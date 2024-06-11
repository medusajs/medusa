import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Switch } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Fragment } from "react"
import { Divider } from "../../../../../components/common/divider"
import { Form } from "../../../../../components/common/form"
import { Combobox } from "../../../../../components/inputs/combobox"
import { CountrySelect } from "../../../../../components/inputs/country-select"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useCreateProductVariant } from "../../../../../hooks/api/products"
import { castNumber } from "../../../../../lib/cast-number"
import { optionalInt } from "../../../../../lib/validation"
import { HttpTypes } from "@medusajs/types"

type CreateProductVariantFormProps = {
  product: HttpTypes.AdminProduct
  isStockAndInventoryEnabled?: boolean
}

const CreateProductVariantSchema = z.object({
  title: z.string().min(1),
  material: z.string().optional(),
  sku: z.string().optional(),
  ean: z.string().optional(),
  upc: z.string().optional(),
  barcode: z.string().optional(),
  inventory_quantity: optionalInt,
  manage_inventory: z.boolean(),
  allow_backorder: z.boolean(),
  weight: optionalInt,
  height: optionalInt,
  width: optionalInt,
  length: optionalInt,
  mid_code: z.string().optional(),
  hs_code: z.string().optional(),
  origin_country: z.string().optional(),
  options: z.record(z.string()),
})

export const CreateProductVariantForm = ({
  product,
  isStockAndInventoryEnabled = false,
}: CreateProductVariantFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof CreateProductVariantSchema>>({
    defaultValues: {
      inventory_quantity: 0,
      manage_inventory: true,
      allow_backorder: false,
      options: {},
    },
    resolver: zodResolver(CreateProductVariantSchema),
  })

  const { mutateAsync, isLoading } = useCreateProductVariant(product.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    const parseNumber = (value?: string | number) => {
      if (typeof value === "undefined" || value === "") {
        return undefined
      }

      if (typeof value === "string") {
        return castNumber(value)
      }

      return value
    }

    const {
      weight,
      height,
      width,
      length,
      inventory_quantity,
      allow_backorder,
      manage_inventory,
      sku,
      ean,
      upc,
      barcode,
      ...rest
    } = data

    /**
     * If stock and inventory is not enabled, we need to send the inventory and
     * stock related fields to the API. If it is enabled, it should be handled
     * in the separate stock and inventory form.
     */
    const conditionalPayload = !isStockAndInventoryEnabled
      ? {
          sku,
          ean,
          upc,
          barcode,
          inventory_quantity: parseNumber(inventory_quantity),
          allow_backorder,
          manage_inventory,
        }
      : {}

    await mutateAsync(
      {
        weight: parseNumber(weight),
        height: parseNumber(height),
        width: parseNumber(width),
        length: parseNumber(length),
        prices: [],
        ...conditionalPayload,
        ...rest,
      },
      {
        onSuccess: () => {
          handleSuccess()
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex size-full flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex size-full flex-col gap-y-8 overflow-auto">
          <div className="flex flex-col gap-y-4">
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
              name="material"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label optional>{t("fields.material")}</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            {product.options.map((option: any) => {
              return (
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
              )
            })}
          </div>
          <Divider />
          {!isStockAndInventoryEnabled && (
            <Fragment>
              <div className="flex flex-col gap-y-8">
                <div className="flex flex-col gap-y-4">
                  <Heading level="h2">
                    {t("products.variant.inventory.header")}
                  </Heading>
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
                  <Form.Field
                    control={form.control}
                    name="ean"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label optional>{t("fields.ean")}</Form.Label>
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
                    name="upc"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label optional>{t("fields.upc")}</Form.Label>
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
                    name="barcode"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label optional>
                            {t("fields.barcode")}
                          </Form.Label>
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
                    name="inventory_quantity"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label>
                            {t("fields.inventoryQuantity")}
                          </Form.Label>
                          <Form.Control>
                            <Input type="number" {...field} />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                </div>
                <Form.Field
                  control={form.control}
                  name="manage_inventory"
                  render={({ field: { value, onChange, ...field } }) => {
                    return (
                      <Form.Item>
                        <div className="flex flex-col gap-y-1">
                          <div className="flex items-center justify-between">
                            <Form.Label>
                              {t(
                                "products.variant.inventory.manageInventoryLabel"
                              )}
                            </Form.Label>
                            <Form.Control>
                              <Switch
                                checked={value}
                                onCheckedChange={(checked) =>
                                  onChange(!!checked)
                                }
                                {...field}
                              />
                            </Form.Control>
                          </div>
                          <Form.Hint>
                            {t(
                              "products.variant.inventory.manageInventoryHint"
                            )}
                          </Form.Hint>
                        </div>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="allow_backorder"
                  render={({ field: { value, onChange, ...field } }) => {
                    return (
                      <Form.Item>
                        <div className="flex flex-col gap-y-1">
                          <div className="flex items-center justify-between">
                            <Form.Label>
                              {t(
                                "products.variant.inventory.allowBackordersLabel"
                              )}
                            </Form.Label>
                            <Form.Control>
                              <Switch
                                checked={value}
                                onCheckedChange={(checked) =>
                                  onChange(!!checked)
                                }
                                {...field}
                              />
                            </Form.Control>
                          </div>
                          <Form.Hint>
                            {t(
                              "products.variant.inventory.allowBackordersHint"
                            )}
                          </Form.Hint>
                        </div>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
              <Divider />
            </Fragment>
          )}
          <div className="flex flex-col gap-y-4">
            <Heading level="h2">{t("products.attributes")}</Heading>
            <Form.Field
              control={form.control}
              name="weight"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label optional>{t("fields.weight")}</Form.Label>
                    <Form.Control>
                      <Input type="number" {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="width"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label optional>{t("fields.width")}</Form.Label>
                    <Form.Control>
                      <Input type="number" {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="length"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label optional>{t("fields.length")}</Form.Label>
                    <Form.Control>
                      <Input type="number" {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="height"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label optional>{t("fields.height")}</Form.Label>
                    <Form.Control>
                      <Input type="number" {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="mid_code"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label optional>{t("fields.midCode")}</Form.Label>
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
              name="hs_code"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label optional>{t("fields.hsCode")}</Form.Label>
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
              name="origin_country"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label optional>
                      {t("fields.countryOfOrigin")}
                    </Form.Label>
                    <Form.Control>
                      <CountrySelect {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
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
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
