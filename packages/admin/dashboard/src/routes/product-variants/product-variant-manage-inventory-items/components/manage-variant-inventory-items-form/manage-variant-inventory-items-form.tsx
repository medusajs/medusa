import { zodResolver } from "@hookform/resolvers/zod"
import { XMarkMini } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, Heading, IconButton, Input, Label, toast } from "@medusajs/ui"
import i18next from "i18next"
import {
  useFieldArray,
  useForm,
  UseFormReturn,
  useWatch,
} from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form"
import { Combobox } from "../../../../../components/inputs/combobox"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useProductVariantsInventoryItemsBatch } from "../../../../../hooks/api/products"
import { useComboboxData } from "../../../../../hooks/use-combobox-data"
import { castNumber } from "../../../../../lib/cast-number"
import { sdk } from "../../../../../lib/client"
import { ExtendedVariant } from "../../../product-variant-detail/constants"

type ManageVariantInventoryItemsFormProps = {
  variant: ExtendedVariant
}

const ManageVariantInventoryItemsSchema = zod.object({
  inventory: zod.array(
    zod
      .object({
        inventory_item_id: zod
          .string()
          .min(1, i18next.t("products.variant.inventory.validation.itemId")),
        required_quantity: zod.union([zod.number(), zod.string()]),
      })
      .superRefine((data, ctx) => {
        const quantity = data.required_quantity
          ? castNumber(data.required_quantity)
          : 0

        if (quantity < 1) {
          ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: i18next.t(
              "products.variant.inventory.validation.quantity"
            ),
            path: ["required_quantity"],
          })
        }
      })
  ),
})

type InventoryFormSchema = zod.infer<typeof ManageVariantInventoryItemsSchema>

type VariantInventoryItemRowProps = {
  form: UseFormReturn<InventoryFormSchema>
  inventoryIndex: number
  inventoryItem: {
    id: string
    inventory_item_id: string
    required_quantity: string | number
  }
  isItemOptionDisabled: (
    option: { value: string },
    inventoryIndex: number
  ) => boolean
  onRemove: () => void
}

function VariantInventoryItemRow({
  form,
  inventoryIndex,
  inventoryItem,
  isItemOptionDisabled,
  onRemove,
}: VariantInventoryItemRowProps) {
  const { t } = useTranslation()

  const selectedInventoryItemId = useWatch({
    control: form.control,
    name: `inventory.${inventoryIndex}.inventory_item_id`,
  })

  const items = useComboboxData({
    queryKey: ["inventory_items"],
    defaultValueKey: "id",
    defaultValue: inventoryItem.inventory_item_id,
    selectedValue: selectedInventoryItemId,
    queryFn: (params) => sdk.admin.inventoryItem.list(params),
    getOptions: (data) =>
      data.inventory_items.map((item) => ({
        label: `${item.title} ${item.sku ? `(${item.sku})` : ""}`,
        value: item.id!,
      })),
  })

  return (
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
                    options={items.options.map((o) => ({
                      ...o,
                      disabled: isItemOptionDisabled(o, inventoryIndex),
                    }))}
                    searchValue={items.searchValue}
                    onSearchValueChange={items.onSearchValueChange}
                    onBlur={() => items.onSearchValueChange("")}
                    fetchNextPage={items.fetchNextPage}
                    className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover"
                    placeholder={t("products.create.inventory.itemPlaceholder")}
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
                    onChange={onChange}
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
        onClick={onRemove}
      >
        <XMarkMini />
      </IconButton>
    </li>
  )
}

export function ManageVariantInventoryItemsForm({
  variant,
}: ManageVariantInventoryItemsFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const filteredInventory =
    variant.inventory_items?.filter((i) => i.inventory) || []

  const form = useForm<zod.infer<typeof ManageVariantInventoryItemsSchema>>({
    defaultValues: {
      inventory: filteredInventory.length
        ? filteredInventory.map((i) => ({
            required_quantity: i.required_quantity,
            inventory_item_id: i.inventory!.id,
          }))
        : [
            {
              inventory_item_id: "",
              required_quantity: "",
            },
          ],
    },
    resolver: zodResolver(ManageVariantInventoryItemsSchema),
  })

  const inventory = useFieldArray({
    control: form.control,
    name: `inventory`,
  })

  const inventoryFormData = useWatch({
    control: form.control,
    name: `inventory`,
  })

  /**
   * Will mark an option as disabled if another input already selected that option
   */
  const isItemOptionDisabled = (
    option: { value: string },
    inventoryIndex: number
  ) => {
    return !!inventoryFormData?.some(
      (i, index) =>
        index != inventoryIndex && i.inventory_item_id === option.value
    )
  }

  const hasKit = inventory.fields.length > 1

  const { mutateAsync, isPending } = useProductVariantsInventoryItemsBatch(
    variant?.product_id!
  )

  const handleSubmit = form.handleSubmit(async (values) => {
    const existingItems: Record<string, number> = {}
    const selectedItems: Record<string, boolean> = {}

    filteredInventory.forEach(
      (i) => (existingItems[i.inventory!.id] = i.required_quantity ?? 0)
    )

    values.inventory.forEach((i) => (selectedItems[i.inventory_item_id] = true))

    const payload: HttpTypes.AdminBatchProductVariantInventoryItemRequest = {}

    values.inventory.forEach((v) => {
      if (v.inventory_item_id in existingItems) {
        if (v.required_quantity !== existingItems[v.inventory_item_id]) {
          payload.update = payload.update || []

          payload.update.push({
            required_quantity: castNumber(v.required_quantity),
            inventory_item_id: v.inventory_item_id,
            variant_id: variant.id,
          })
        }
      } else {
        payload.create = payload.create || []

        payload.create.push({
          required_quantity: castNumber(v.required_quantity),
          inventory_item_id: v.inventory_item_id,
          variant_id: variant.id,
        })
      }
    })

    filteredInventory.forEach((i) => {
      if (!(i.inventory!.id in selectedItems)) {
        payload.delete = payload.delete || []

        payload.delete.push({
          inventory_item_id: i.inventory!.id,
          variant_id: variant.id,
        })
      }
    })

    await mutateAsync(payload, {
      onSuccess: () => {
        toast.success(t("products.variant.inventory.toast.itemsManageSuccess"))
        handleSuccess()
      },
      onError: (err) => {
        toast.error(err.message)
      },
    })
  })

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm className="flex h-full flex-col" onSubmit={handleSubmit}>
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="flex justify-center overflow-auto">
          <div className="flex w-full flex-col gap-y-8 px-6 pt-12 md:w-[720px] md:pt-24">
            <Heading>
              {t(
                hasKit
                  ? "products.create.inventory.heading"
                  : "fields.inventoryItems"
              )}
            </Heading>

            <div className="grid gap-y-4 pb-8">
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
                <VariantInventoryItemRow
                  key={inventoryItem.id}
                  form={form}
                  inventoryIndex={inventoryIndex}
                  inventoryItem={inventoryItem}
                  isItemOptionDisabled={isItemOptionDisabled}
                  onRemove={() => inventory.remove(inventoryIndex)}
                />
              ))}
            </div>
          </div>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <RouteFocusModal.Close asChild>
            <Button size="small" variant="secondary">
              {t("actions.cancel")}
            </Button>
          </RouteFocusModal.Close>
          <Button size="small" type="submit" isLoading={isPending}>
            {t("actions.save")}
          </Button>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}
