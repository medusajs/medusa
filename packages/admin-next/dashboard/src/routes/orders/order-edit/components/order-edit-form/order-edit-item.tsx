import React from "react"
import { useTranslation } from "react-i18next"
import { UseFormReturn } from "react-hook-form"

import { Input, Text } from "@medusajs/ui"
import { LineItem } from "@medusajs/medusa"

import { MoneyAmountCell } from "../../../../../components/table/table-cells/common/money-amount-cell"
import { Thumbnail } from "../../../../../components/common/thumbnail"
import { Trash } from "@medusajs/icons"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { Form } from "../../../../../components/common/form"

type OrderEditItemProps = {
  item: LineItem
  currencyCode: string

  form: UseFormReturn<Record<string, number>>
  onQuantityChangeComplete: (id: string) => void
  onRemove: (id: string) => void
}

function OrderEditItem({
  item,
  currencyCode,
  form,
  onQuantityChangeComplete,
  onRemove,
}: OrderEditItemProps) {
  const { t } = useTranslation()

  const thumbnail = item.thumbnail

  return (
    <div className="bg-ui-bg-subtle shadow-elevation-card-rest my-2 rounded-xl">
      <div className="flex gap-x-2 border-b p-3 text-sm">
        <div className="flex flex-grow items-center gap-x-3">
          <Thumbnail src={thumbnail} />
          <div className="flex flex-col">
            <div>
              <Text as="span" weight="plus">
                {item.title}
              </Text>
              {item.variant.sku && <span>(${item.variant.sku})</span>}
            </div>
            <Text as="div" className="text-ui-fg-subtle">
              {item.variant.title}
            </Text>
          </div>
        </div>

        <div className="text-ui-fg-subtle flex flex-shrink-0">
          <MoneyAmountCell currencyCode={currencyCode} amount={item.total} />
        </div>

        <div className="flex items-center">
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("actions.remove"),
                    icon: <Trash />,
                    onClick: () => onRemove(item.id),
                  },
                ],
              },
            ]}
          />
        </div>
      </div>

      <div className="block p-3 text-sm">
        <Text weight="plus" className="mb-2">
          {t("fields.quantity")}
        </Text>

        <Form.Field
          control={form.control}
          name={item.id}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Control>
                  <Input
                    className="bg-ui-bg-base w-full rounded-lg"
                    min={1}
                    type="number"
                    {...field}
                    onChange={(e) => {
                      const val = e.target.value
                      field.onChange(val === "" ? null : Number(val))
                    }}
                    onBlur={() => {
                      if (typeof form.getValues()[item.id] === "undefined") {
                        field.onChange(1)
                      }
                      onQuantityChangeComplete(item.id)
                    }}
                  />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
      </div>
    </div>
  )
}

export { OrderEditItem }
