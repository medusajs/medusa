import React from "react"
import { useTranslation } from "react-i18next"

import { Trash } from "@medusajs/icons"
import { clx, Input, Select, Text } from "@medusajs/ui"
import { UseFormReturn } from "react-hook-form"

import { MoneyAmountCell } from "../../../../../../components/table/table-cells/common/money-amount-cell"
import { ActionMenu } from "../../../../../../components/common/action-menu"
import { Thumbnail } from "../../../../../../components/common/thumbnail"
import { Form } from "../../../../../../components/common/form"
import { ReturnItem } from "../../../../../../lib/rma"

const claimReturnReasons = [
  {
    label: "Missing Item",
    value: "missing_item",
  },
  {
    label: "Wrong Item",
    value: "wrong_item",
  },
  {
    label: "Production Failure",
    value: "production_failure",
  },
  {
    label: "Other",
    value: "other",
  },
]

type OrderCreateClaimItemProps = {
  item: ReturnItem
  currencyCode: string
  isAddedItem?: boolean
  form: UseFormReturn<any>
  onVariantRemove?: (variantId: string) => {}
}

function OrderCreateClaimItem({
  item,
  currencyCode,
  form,
  isAddedItem,
  onVariantRemove,
}: OrderCreateClaimItemProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-ui-bg-subtle shadow-elevation-card-rest my-2 rounded-xl ">
      <div className="flex gap-x-2 border-b p-3 text-sm">
        <div className="flex flex-grow items-center gap-x-3">
          <Thumbnail src={item.thumbnail} />
          <div className="flex flex-col">
            <div>
              <Text className="txt-small" as="span" weight="plus">
                {item.title}
              </Text>
              {item.variant.sku && <span>({item.variant.sku})</span>}
            </div>
            <Text as="div" className="text-ui-fg-subtle txt-small">
              {item.variant.title}
            </Text>
          </div>
        </div>

        <div className="text-ui-fg-subtle txt-small mr-2 flex flex-shrink-0">
          <MoneyAmountCell currencyCode={currencyCode} amount={item.total} />
        </div>

        <div className="flex items-center">
          {onVariantRemove && (
            <ActionMenu
              groups={[
                {
                  actions: [
                    {
                      label: t("actions.remove"),
                      icon: <Trash />,
                      onClick: () => onVariantRemove(item.id),
                    },
                  ],
                },
              ]}
            />
          )}
        </div>
      </div>

      <div className="block p-3 text-sm">
        <div
          className={clx("grid grid-cols-1 gap-3", {
            "md:grid-cols-3": !isAddedItem,
          })}
        >
          <div className="flex-1">
            <Text weight="plus" className="txt-small mb-2">
              {t("fields.quantity")}
            </Text>
            <Form.Field
              control={form.control}
              name={`quantity.${item.id}`}
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Control>
                      <Input
                        className="bg-ui-bg-base txt-small w-full rounded-lg"
                        min={1}
                        max={
                          !isAddedItem
                            ? item.returnable_quantity || item.quantity
                            : undefined
                        }
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const val = e.target.value
                          field.onChange(val === "" ? null : Number(val))
                        }}
                      />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          </div>

          {!isAddedItem && (
            <div className="flex-1">
              <Text weight="plus" className="txt-small mb-2">
                {t("fields.reason")}
              </Text>
              <Form.Field
                control={form.control}
                name={`reason.${item.id}`}
                render={({ field: { onChange, ref, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Control>
                        <Select onValueChange={onChange} {...field}>
                          <Select.Trigger
                            className="bg-ui-bg-base txt-small"
                            ref={ref}
                          >
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Content>
                            {claimReturnReasons.map((i) => (
                              <Select.Item key={i.value} value={i.value}>
                                {i.label}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select>
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
          )}

          {!isAddedItem && (
            <div className="flex-1">
              <Text weight="plus" className="txt-small mb-2">
                {t("fields.note")}
              </Text>
              <Form.Field
                control={form.control}
                name={`note.${item.id}`}
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Control>
                        <Input className="bg-ui-bg-base txt-small" {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { OrderCreateClaimItem }
