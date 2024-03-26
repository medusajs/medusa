import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { LineItem } from "@medusajs/medusa"
import { Input, Text } from "@medusajs/ui"
import { UseFormReturn } from "react-hook-form"

import { CreateFulfillmentSchema } from "./constants"
import { Form } from "../../../../../components/common/form"
import { Thumbnail } from "../../../../../components/common/thumbnail"
import { MoneyAmountCell } from "../../../../../components/table/table-cells/common/money-amount-cell"

type OrderEditItemProps = {
  item: LineItem
  currencyCode: string

  form: UseFormReturn<zod.infer<typeof CreateFulfillmentSchema>>
}

export function OrderCreateFulfillmentItem({
  item,
  currencyCode,
  form,
}: OrderEditItemProps) {
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
      </div>

      <div className="block p-3 text-sm">
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
                      max={item.quantity}
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
      </div>
    </div>
  )
}
