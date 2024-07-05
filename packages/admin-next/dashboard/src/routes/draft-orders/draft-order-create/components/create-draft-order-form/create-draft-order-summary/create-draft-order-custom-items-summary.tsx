import { Text } from "@medusajs/ui"

import { Divider } from "../../../../../../components/common/divider"
import { castNumber } from "../../../../../../lib/cast-number"
import {
  getDbAmount,
  getLocaleAmount,
} from "../../../../../../lib/money-amount-helpers"
import { useCreateDraftOrder } from "../hooks"

export const CreateDraftOrderCustomItemsSummary = () => {
  const { form, region } = useCreateDraftOrder()
  const { currency_code } = region || {}

  const items = form.getValues("custom_items") || []

  if (!items.length) {
    return null
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {items.map((item, index) => {
        const price = item.unit_price
          ? getDbAmount(castNumber(item.unit_price), currency_code!)
          : item.unit_price
        const subtotal = price * item.quantity

        return (
          <div key={index} className="grid grid-cols-2 items-start gap-4">
            <Text
              size="small"
              leading="compact"
              weight="plus"
              className="text-ui-fg-base"
            >
              {item.title}
            </Text>
            <div className="grid grid-cols-3 items-center gap-x-4">
              <div className="flex items-center justify-end gap-x-2">
                <Text size="small">
                  {getLocaleAmount(price, currency_code!)}
                </Text>
              </div>
              <div className="min-w-[27px] text-right">
                <Text>
                  <span className="tabular-nums">{item.quantity}</span>x
                </Text>
              </div>
              <div className="flex items-center justify-end">
                <Text size="small">
                  {getLocaleAmount(subtotal, currency_code!)}
                </Text>
              </div>
            </div>
          </div>
        )
      })}
      <Divider variant="dashed" />
    </div>
  )
}
