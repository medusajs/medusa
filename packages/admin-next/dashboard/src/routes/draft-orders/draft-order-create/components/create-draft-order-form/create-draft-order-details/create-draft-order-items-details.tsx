import { Trash } from "@medusajs/icons"
import { Button, CurrencyInput, Input, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../../components/common/action-menu"
import { ConditionalTooltip } from "../../../../../../components/common/conditional-tooltip"
import { Form } from "../../../../../../components/common/form"
import { Thumbnail } from "../../../../../../components/common/thumbnail"
import { getStylizedAmount } from "../../../../../../lib/money-amount-helpers"
import { View } from "../constants"
import { useCreateDraftOrder } from "../hooks"

export const CreateDraftOrderItemsDetails = () => {
  const { t } = useTranslation()

  const { region, variants, custom, form, onOpenDrawer } = useCreateDraftOrder()
  const { currency_code, currency } = region || {}

  return (
    <div className="flex flex-col gap-y-8">
      <fieldset className="flex flex-col gap-y-4">
        <Form.Field
          control={form.control}
          name="existing_items"
          render={({ field: { name } }) => {
            return (
              <Form.Item className="flex flex-col gap-y-4">
                <div>
                  <Form.Label>
                    {t("draftOrders.create.existingItemsLabel")}
                  </Form.Label>
                  <Form.Hint>
                    {t("draftOrders.create.existingItemsHint")}
                  </Form.Hint>
                </div>
                {variants.items.length > 0 ? (
                  variants.items.map((item, index) => {
                    return (
                      <div
                        key={item.ei_id}
                        className="bg-ui-bg-component shadow-elevation-card-rest divide-y rounded-xl"
                      >
                        <div className="flex items-center justify-between p-3">
                          <div className="flex items-center gap-x-2">
                            <div className="shadow-borders-base size-fit overflow-hidden rounded-[4px]">
                              <Thumbnail src={item.thumbnail} />
                            </div>
                            <div>
                              <div className="flex items-center gap-x-1">
                                <Text
                                  size="small"
                                  leading="compact"
                                  weight="plus"
                                >
                                  {item.product_title}
                                </Text>
                                {item.sku && (
                                  <Text
                                    size="small"
                                    leading="compact"
                                    className="text-ui-fg-subtle"
                                  >
                                    ({item.sku})
                                  </Text>
                                )}
                              </div>
                              <Text
                                size="small"
                                leading="compact"
                                className="text-ui-fg-subtle"
                              >
                                {item.variant_title}
                              </Text>
                            </div>
                          </div>
                          <div className="flex items-center gap-x-3">
                            <Text
                              size="small"
                              leading="compact"
                              className="text-ui-fg-subtle"
                            >
                              {getStylizedAmount(
                                item.unit_price,
                                currency_code!
                              )}
                            </Text>
                            <ActionMenu
                              groups={[
                                {
                                  actions: [
                                    {
                                      label: t("actions.remove"),
                                      onClick: () => variants.remove(index),
                                      icon: <Trash />,
                                    },
                                  ],
                                },
                              ]}
                            />
                          </div>
                        </div>
                        <fieldset className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2">
                          <Form.Field
                            control={form.control}
                            name={`${name}.${index}.quantity`}
                            render={({ field: { onChange, ...field } }) => {
                              return (
                                <Form.Item>
                                  <Form.Label>
                                    {t("fields.quantity")}
                                  </Form.Label>
                                  <Form.Control>
                                    <Input
                                      className="!bg-ui-bg-field-component hover:!bg-ui-bg-field-component-hover"
                                      type="number"
                                      onChange={(e) =>
                                        onChange(Number(e.target.value))
                                      }
                                      {...field}
                                    />
                                  </Form.Control>
                                </Form.Item>
                              )
                            }}
                          />
                          <Form.Field
                            control={form.control}
                            name={`${name}.${index}.custom_unit_price`}
                            render={({ field: { onChange, ...field } }) => {
                              return (
                                <Form.Item>
                                  <Form.Label optional>
                                    {t(
                                      "draftOrders.create.unitPriceOverrideLabel"
                                    )}
                                  </Form.Label>
                                  <Form.Control>
                                    <CurrencyInput
                                      className="!bg-ui-bg-field-component hover:!bg-ui-bg-field-component-hover"
                                      code={currency_code!}
                                      symbol={currency?.symbol_native!}
                                      onValueChange={onChange}
                                      {...field}
                                    />
                                  </Form.Control>
                                  <Form.ErrorMessage />
                                </Form.Item>
                              )
                            }}
                          />
                        </fieldset>
                      </div>
                    )
                  })
                ) : (
                  <div className="flex items-center justify-center px-2 py-3">
                    <Text
                      size="small"
                      leading="compact"
                      className="text-ui-fg-muted"
                    >
                      {t("draftOrders.create.noExistingItemsAddedLabel")}
                    </Text>
                  </div>
                )}
                <div className="flex items-center justify-end">
                  <ConditionalTooltip
                    content={t("draftOrders.create.chooseRegionTooltip")}
                    showTooltip={!region}
                  >
                    <Button
                      disabled={!region}
                      variant="secondary"
                      size="small"
                      type="button"
                      onClick={() => onOpenDrawer(View.EXISTING_ITEMS)}
                    >
                      {t("draftOrders.create.addExistingItemsAction")}
                    </Button>
                  </ConditionalTooltip>
                </div>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
      </fieldset>
      <div className="md:grid-grid-cols-2 grid grid-cols-1 gap-3 p-3">
        <Form.Field
          control={form.control}
          name="custom_items"
          render={({ field: { name } }) => {
            return (
              <Form.Item className="flex flex-col gap-y-4">
                <div>
                  <Form.Label>
                    {t("draftOrders.create.customItemsLabel")}
                  </Form.Label>
                  <Form.Hint>
                    {t("draftOrders.create.customItemsHint")}
                  </Form.Hint>
                </div>
                {custom.items.length > 0 ? (
                  custom.items.map((item, index) => {
                    return (
                      <div
                        key={item.ci_id}
                        className="bg-ui-bg-component shadow-elevation-card-rest divide-y rounded-xl"
                      >
                        <div className="flex items-center justify-between p-3">
                          <div>
                            <div className="flex items-center gap-x-1">
                              <Text
                                size="small"
                                leading="compact"
                                weight="plus"
                              >
                                {item.title}
                              </Text>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <ActionMenu
                              groups={[
                                {
                                  actions: [
                                    {
                                      label: t("actions.remove"),
                                      onClick: () => custom.remove(index),
                                      icon: <Trash />,
                                    },
                                  ],
                                },
                              ]}
                            />
                          </div>
                        </div>
                        <fieldset className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2">
                          <Form.Field
                            control={form.control}
                            name={`${name}.${index}.quantity`}
                            render={({ field }) => {
                              return (
                                <Form.Item>
                                  <Form.Label>
                                    {t("fields.quantity")}
                                  </Form.Label>
                                  <Form.Control>
                                    <Input
                                      className="!bg-ui-bg-field-component hover:!bg-ui-bg-field-component-hover"
                                      type="number"
                                      {...field}
                                    />
                                  </Form.Control>
                                </Form.Item>
                              )
                            }}
                          />
                          <Form.Field
                            control={form.control}
                            name={`${name}.${index}.unit_price`}
                            render={({ field: { onChange, ...field } }) => {
                              return (
                                <Form.Item>
                                  <Form.Label>
                                    {t("fields.unitPrice")}
                                  </Form.Label>
                                  <Form.Control>
                                    <CurrencyInput
                                      className="!bg-ui-bg-field-component hover:!bg-ui-bg-field-component-hover"
                                      code={currency_code!}
                                      symbol={currency?.symbol_native!}
                                      onValueChange={onChange}
                                      {...field}
                                    />
                                  </Form.Control>
                                </Form.Item>
                              )
                            }}
                          />
                        </fieldset>
                      </div>
                    )
                  })
                ) : (
                  <div className="flex items-center justify-center px-2 py-3">
                    <Text
                      size="small"
                      leading="compact"
                      className="text-ui-fg-muted"
                    >
                      {t("draftOrders.create.noCustomItemsAddedLabel")}
                    </Text>
                  </div>
                )}
                <div className="flex items-center justify-end">
                  <ConditionalTooltip
                    content={t("draftOrders.create.chooseRegionTooltip")}
                    showTooltip={!region}
                  >
                    <Button
                      variant="secondary"
                      size="small"
                      type="button"
                      disabled={!region}
                      onClick={() => onOpenDrawer(View.CUSTOM_ITEMS)}
                    >
                      {t("draftOrders.create.addCustomItemAction")}
                    </Button>
                  </ConditionalTooltip>
                </div>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
      </div>
    </div>
  )
}
