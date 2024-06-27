import { Button, Heading, IconButton, Input, Label, toast } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useFieldArray, useForm } from "react-hook-form"
import { XMarkMini } from "@medusajs/icons"
import * as zod from "zod"
import i18next from "i18next"
import { zodResolver } from "@hookform/resolvers/zod"
import { AdminInventoryItem, AdminProductVariant } from "@medusajs/types"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { Form } from "../../../../../components/common/form"
import { Combobox } from "../../../../../components/inputs/combobox"
import { useComboboxData } from "../../../../../hooks/use-combobox-data"
import { useProductVariantsInventoryItemsBatch } from "../../../../../hooks/api/products"
import { sdk } from "../../../../../lib/client"

type ManageVariantInventoryItemsFormProps = {
  variant: AdminProductVariant & {
    inventory_items: {
      inventory: AdminInventoryItem[]
      required_quantity: number
    }
  }
}

const ManageVariantInventoryItemsSchema = zod.object({
  inventory: zod.array(
    zod.object({
      inventory_item_id: zod
        .string()
        .min(1, i18next.t("products.variant.inventory.validation.itemId")),
      required_quantity: zod
        .number({
          errorMap: () => ({
            message: i18next.t(
              "products.variant.inventory.validation.quantity"
            ),
          }),
        })
        .min(0, i18next.t("products.variant.inventory.validation.quantity")),
    })
  ),
})

export function ManageVariantInventoryItemsForm({
  variant,
}: ManageVariantInventoryItemsFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof ManageVariantInventoryItemsSchema>>({
    defaultValues: {
      inventory: variant.inventory_items!.map((i) => ({
        required_quantity: i.required_quantity,
        inventory_item_id: i.inventory.id,
      })),
    },
    resolver: zodResolver(ManageVariantInventoryItemsSchema),
  })

  const inventory = useFieldArray({
    control: form.control,
    name: `inventory`,
  })

  const hasKit = inventory.fields.length > 1

  const items = useComboboxData({
    queryKey: ["inventory_items"],
    queryFn: (params) => sdk.admin.inventoryItem.list(params),
    getOptions: (data) =>
      data.inventory_items.map((item) => ({
        label: item.title,
        value: item.id,
      })),
  })

  const { mutateAsync, isPending } = useProductVariantsInventoryItemsBatch(
    variant.product_id
  )

  const handleSubmit = form.handleSubmit(async (values) => {
    const existingItems = {}
    const selectedItems = {}

    variant.inventory_items.forEach(
      (i) => (existingItems[i.inventory.id] = i.required_quantity)
    )

    values.inventory.forEach((i) => (selectedItems[i.inventory_item_id] = true))

    const payload = {
      create: [],
      update: [],
      delete: [],
    }

    values.inventory.forEach((v) => {
      if (v.inventory_item_id in existingItems) {
        if (v.required_quantity !== existingItems[v.inventory_item_id]) {
          payload.update.push({
            required_quantity: v.required_quantity,
            inventory_item_id: v.inventory_item_id,
            variant_id: variant.id,
          })
        }
      } else {
        payload.create.push({
          required_quantity: v.required_quantity,
          inventory_item_id: v.inventory_item_id,
          variant_id: variant.id,
        })
      }
    })

    variant.inventory_items.forEach((i) => {
      if (!(i.inventory.id in selectedItems)) {
        payload.delete.push({
          inventory_item_id: i.inventory.id,
          variant_id: variant.id,
        })
      }
    })

    for (const k in payload) {
      if (!payload[k].length) {
        delete payload[k]
      }
    }

    await mutateAsync(payload, {
      onSuccess: () => {
        toast.success(t("general.success"), {
          description: t("products.variant.inventory.toast.itemsManageSuccess"),
          dismissLabel: t("general.close"),
        })
        handleSuccess()
      },
      onError: (err) => {
        toast.error(t("general.error"), {
          description: err.message,
          dismissLabel: t("general.close"),
        })
      },
    })
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form
        className="flex h-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex justify-center">
          <div className="flex w-full flex-col gap-y-8 px-6 pt-12 md:w-[720px] md:pt-24">
            <Heading>
              {t(
                hasKit
                  ? "products.create.inventory.heading"
                  : "fields.inventoryItems"
              )}
            </Heading>

            <div className="grid gap-y-4">
              <div className="flex items-start justify-between gap-x-4">
                <div className="flex flex-col">
                  <Form.Label>{variant.title}</Form.Label>
                  <Form.Hint>
                    {t(
                      hasKit
                        ? "products.create.inventory.label"
                        : "fields.inventoryItem"
                    )}
                  </Form.Hint>
                </div>
                <Button
                  size="small"
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    inventory.append({
                      inventory_item_id: "",
                      required_quantity: "",
                    })
                  }}
                >
                  {t("actions.add")}
                </Button>
              </div>
              {inventory.fields.map((inventoryItem, inventoryIndex) => (
                <li
                  key={inventoryItem.id}
                  className="bg-ui-bg-component shadow-elevation-card-rest grid grid-cols-[1fr_28px] items-center gap-1.5 rounded-xl p-1.5"
                >
                  <div className="grid grid-cols-[min-content,1fr] items-center gap-1.5">
                    <div className="flex items-center px-2 py-1.5">
                      <Label
                        size="xsmall"
                        weight="plus"
                        className="text-ui-fg-subtle"
                        htmlFor={`inventory.${inventoryIndex}.inventory_item_id`}
                      >
                        {t("fields.item")}
                      </Label>
                    </div>

                    <Form.Field
                      control={form.control}
                      name={`inventory.${inventoryIndex}.inventory_item_id`}
                      render={({ field }) => {
                        return (
                          <Form.Item>
                            <Form.Control>
                              <Combobox
                                {...field}
                                options={items.options}
                                searchValue={items.searchValue}
                                onSearchValueChange={items.onSearchValueChange}
                                fetchNextPage={items.fetchNextPage}
                                className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover"
                                placeholder={t(
                                  "products.create.inventory.itemPlaceholder"
                                )}
                              />
                            </Form.Control>
                            <Form.ErrorMessage />
                          </Form.Item>
                        )
                      }}
                    />

                    <div className="flex items-center px-2 py-1.5">
                      <Label
                        size="xsmall"
                        weight="plus"
                        className="text-ui-fg-subtle"
                        htmlFor={`inventory.${inventoryIndex}.required_quantity`}
                      >
                        {t("fields.quantity")}
                      </Label>
                    </div>
                    <Form.Field
                      control={form.control}
                      name={`inventory.${inventoryIndex}.required_quantity`}
                      render={({ field: { onChange, value, ...field } }) => {
                        return (
                          <Form.Item>
                            <Form.Control>
                              <Input
                                type="number"
                                className="bg-ui-bg-field-component"
                                min={0}
                                value={value}
                                onChange={(e) => {
                                  const value = e.target.value

                                  if (value === "") {
                                    onChange(null)
                                  } else {
                                    onChange(Number(value))
                                  }
                                }}
                                {...field}
                                placeholder={t(
                                  "products.create.inventory.quantityPlaceholder"
                                )}
                              />
                            </Form.Control>
                            <Form.ErrorMessage />
                          </Form.Item>
                        )
                      }}
                    />
                  </div>
                  <IconButton
                    type="button"
                    size="small"
                    variant="transparent"
                    className="text-ui-fg-muted"
                    onClick={() => inventory.remove(inventoryIndex)}
                  >
                    <XMarkMini />
                  </IconButton>
                </li>
              ))}
            </div>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
