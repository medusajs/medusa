import { Copy, Text } from "@medusajs/ui"

import { Divider } from "../../../../../../components/common/divider"
import { Thumbnail } from "../../../../../../components/common/thumbnail"
import { castNumber } from "../../../../../../lib/cast-number"
import {
  getDbAmount,
  getLocaleAmount,
} from "../../../../../../lib/money-amount-helpers"
import { useCreateDraftOrder } from "../hooks"

export const CreateDraftOrderVariantItemsSummary = () => {
  const { form, region } = useCreateDraftOrder()
  const { currency_code } = region || {}

  const items = form.getValues("existing_items") || []

  if (!items.length) {
    return null
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {items.map((item) => {
        const price = item.custom_unit_price
          ? getDbAmount(castNumber(item.custom_unit_price), currency_code!)
          : item.unit_price
        const subtotal = price * item.quantity

        return (
          <div
            key={item.variant_id}
            className="grid grid-cols-2 items-start gap-4"
          >
            <div className="flex items-start gap-x-4">
              <Thumbnail src={item.thumbnail} />
              <div>
                <Text
                  size="small"
                  leading="compact"
                  weight="plus"
                  className="text-ui-fg-base"
                >
                  {item.product_title}
                </Text>
                {item.sku && (
                  <div className="flex items-center gap-x-1">
                    <Text size="small">{item.sku}</Text>
                    <Copy content={item.sku} className="text-ui-fg-muted" />
                  </div>
                )}
                <Text size="small">{item.variant_title}</Text>
              </div>
            </div>
            <div className="grid grid-cols-3 items-center gap-x-4">
              <div className="flex items-center justify-end gap-x-2">
                {item.custom_unit_price && (
                  <Text size="small" className="text-ui-fg-muted line-through">
                    {getLocaleAmount(item.unit_price, currency_code!)}
                  </Text>
                )}
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
