import { useTranslation } from "react-i18next"

import { Input, Text } from "@medusajs/ui"
import { UseFormReturn } from "react-hook-form"
import { AdminOrderLineItem } from "@medusajs/types"

import { Thumbnail } from "../../../../../components/common/thumbnail"
import { MoneyAmountCell } from "../../../../../components/table/table-cells/common/money-amount-cell"
import { Form } from "../../../../../components/common/form"

type OrderEditItemProps = {
  item: AdminOrderLineItem
  currencyCode: string
  index: number

  form: UseFormReturn<any>
}

function ReturnItem({ item, currencyCode, form, index }: OrderEditItemProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-ui-bg-subtle shadow-elevation-card-rest my-2 rounded-xl ">
      <div className="flex flex-col gap-x-2 gap-y-2 border-b p-3 text-sm md:flex-row">
        <div className="flex flex-1 items-center gap-x-3">
          <Thumbnail src={item.thumbnail} />
          <div className="flex flex-col">
            <div>
              <Text className="txt-small" as="span" weight="plus">
                {item.title}{" "}
              </Text>
              {item.variant.sku && <span>({item.variant.sku})</span>}
            </div>
            <Text as="div" className="text-ui-fg-subtle txt-small">
              {item.variant.product.title}
            </Text>
          </div>
        </div>

        <div className="flex flex-1 justify-between">
          <div className="flex flex-grow items-center gap-2">
            <Form.Field
              control={form.control}
              name={`items.${index}.quantity`}
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Control>
                      <Input
                        className="bg-ui-bg-base txt-small w-[67px] rounded-lg"
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
            <Text className="txt-small text-ui-fg-subtle">
              {t("fields.qty")}
            </Text>
          </div>

          <div className="text-ui-fg-subtle txt-small mr-2 flex flex-shrink-0">
            <MoneyAmountCell currencyCode={currencyCode} amount={item.total} />
          </div>
        </div>
      </div>
    </div>
  )
}

export { ReturnItem }
