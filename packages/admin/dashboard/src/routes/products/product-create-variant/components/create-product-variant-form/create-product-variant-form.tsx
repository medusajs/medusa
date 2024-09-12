import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Switch } from "@medusajs/ui"
import { useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { HttpTypes } from "@medusajs/types"
import { Form } from "../../../../../components/common/form"
import { Combobox } from "../../../../../components/inputs/combobox"
import {
  RouteDrawer,
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { useCreateProductVariant } from "../../../../../hooks/api/products"
import { CreateProductVariantSchema } from "./constants"

type CreateProductVariantFormProps = {
  product: HttpTypes.AdminProduct
}

export const CreateProductVariantForm = ({
  product,
}: CreateProductVariantFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof CreateProductVariantSchema>>({
    defaultValues: {
      sku: "",
      title: "",
      manage_inventory: true,
      allow_backorder: false,
      inventory_kit: false,
      options: {},
    },
    resolver: zodResolver(CreateProductVariantSchema),
  })

  const { mutateAsync, isPending: isLoading } = useCreateProductVariant(
    product.id
  )

  const handleSubmit = form.handleSubmit(async (data) => {
    const { allow_backorder, manage_inventory, sku, ...rest } = data

    await mutateAsync(
      {
        sku,
        allow_backorder,
        manage_inventory,
        prices: [],
        ...rest,
      },
      {
        onSuccess: () => {
          handleSuccess()
        },
      }
    )
  })

  const manageInventoryEnabled = useWatch({
    control: form.control,
    name: "manage_inventory",
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="md:p-x-0 flex size-full flex-col items-center overflow-auto p-8 md:pb-16 md:pt-16">
          <div className="flex w-full flex-col md:w-[720px]">
            <Heading level="h1">{t("products.variant.create.header")}</Heading>

            <div className="my-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Form.Field
                control={form.control}
                name="title"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.title")}</Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />

              <Form.Field
                control={form.control}
                name="sku"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label optional>{t("fields.sku")}</Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />

              {product.options.map((option: any) => (
                <Form.Field
                  key={option.id}
                  control={form.control}
                  name={`options.${option.title}`}
                  render={({ field: { value, onChange, ...field } }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{option.title}</Form.Label>
                        <Form.Control>
                          <Combobox
                            value={value}
                            onChange={(v) => {
                              onChange(v)
                            }}
                            {...field}
                            options={option.values.map((v: any) => ({
                              label: v.value,
                              value: v.value,
                            }))}
                          />
                        </Form.Control>
                      </Form.Item>
                    )
                  }}
                />
              ))}
            </div>
            <div className="flex flex-col gap-y-4">
              <Form.Field
                control={form.control}
                name="manage_inventory"
                render={({ field: { value, onChange, ...field } }) => {
                  return (
                    <Form.Item>
                      <div className="bg-ui-bg-component shadow-elevation-card-rest flex gap-x-3 rounded-lg p-4">
                        <Form.Control>
                          <Switch
                            className="mt-[2px]"
                            checked={value}
                            onCheckedChange={(checked) => onChange(!!checked)}
                            {...field}
                          />
                        </Form.Control>

                        <div className="flex flex-col">
                          <Form.Label>
                            {t(
                              "products.variant.inventory.manageInventoryLabel"
                            )}
                          </Form.Label>
                          <Form.Hint>
                            {t(
                              "products.variant.inventory.manageInventoryHint"
                            )}
                          </Form.Hint>
                        </div>
                      </div>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="allow_backorder"
                disabled={!manageInventoryEnabled}
                render={({ field: { value, onChange, ...field } }) => {
                  return (
                    <Form.Item>
                      <div className="bg-ui-bg-component shadow-elevation-card-rest flex gap-x-3 rounded-lg p-4">
                        <Form.Control>
                          <Switch
                            checked={value}
                            onCheckedChange={(checked) => onChange(!!checked)}
                            {...field}
                          />
                        </Form.Control>
                        <div className="flex flex-col">
                          <Form.Label>
                            {t(
                              "products.variant.inventory.allowBackordersLabel"
                            )}
                          </Form.Label>
                          <Form.Hint>
                            {t(
                              "products.variant.inventory.allowBackordersHint"
                            )}
                          </Form.Hint>
                        </div>
                      </div>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="inventory_kit"
                disabled={!manageInventoryEnabled}
                render={({ field: { value, onChange, ...field } }) => {
                  return (
                    <Form.Item>
                      <div className="bg-ui-bg-component shadow-elevation-card-rest flex gap-x-3 rounded-lg p-4">
                        <Form.Control>
                          <Switch
                            checked={value}
                            onCheckedChange={(checked) => onChange(!!checked)}
                            {...field}
                          />
                        </Form.Control>
                        <div className="flex flex-col">
                          <Form.Label>
                            {t("products.variant.inventory.inventoryKit")}
                          </Form.Label>
                          <Form.Hint>
                            {t("products.variant.inventory.inventoryKitHint")}
                          </Form.Hint>
                        </div>
                      </div>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
          </div>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button type="submit" size="small" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </form>
    </RouteFocusModal.Form>
  )
}
