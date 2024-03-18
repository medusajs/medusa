import { Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import {
  getDbAmount,
  getLocaleAmount,
} from "../../../../../../lib/money-amount-helpers"
import { useCreateDraftOrder } from "../hooks"
import { ShippingMethod } from "../types"

export const CreateDraftOrderTotalSummary = () => {
  const { t } = useTranslation()
  const { form, region } = useCreateDraftOrder()
  const { currency_code } = region || {}

  const variantItems = form.getValues("existing_items") || []
  const variantItemsSubtotal = variantItems.reduce((acc, item) => {
    const amount = item.custom_unit_price
      ? getDbAmount(Number(item.custom_unit_price), currency_code!)
      : item.unit_price

    return (acc += amount * item.quantity)
  }, 0)

  const customItems = form.getValues("custom_items") || []
  const customItemsSubtotal = customItems.reduce((acc, item) => {
    const amount = getDbAmount(Number(item.unit_price), currency_code!)

    return (acc += amount * item.quantity)
  }, 0)

  const count = variantItems.length + customItems.length
  const subtotal = variantItemsSubtotal + customItemsSubtotal

  const shippingMethod = form.getValues("shipping_method")
  const shippingSubtotal = getShippingSubtotal(shippingMethod, currency_code!)

  return (
    <div className="text-ui-fg-subtle flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <div className="grid grid-cols-3 gap-4">
          <Text size="small" leading="compact">
            {t("fields.subtotal")}
          </Text>
          <Text size="small" leading="compact" className="text-right">
            {t("general.items", { count })}
          </Text>
          <Text size="small" leading="compact" className="text-right">
            {getLocaleAmount(subtotal, currency_code!)}
          </Text>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Text size="small" leading="compact">
            {t("fields.shipping")}
          </Text>
          <Text size="small" leading="compact" className="text-right">
            {shippingMethod.option_title}
          </Text>
          <div className="flex items-center justify-end gap-x-2">
            {shippingMethod.custom_amount && (
              <Text size="small" className="text-ui-fg-muted line-through">
                {getLocaleAmount(
                  Number(shippingMethod.amount || 0),
                  currency_code!
                )}
              </Text>
            )}
            <Text size="small" leading="compact" className="text-right">
              {getLocaleAmount(shippingSubtotal, currency_code!)}
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}

const getShippingSubtotal = (
  shippingMethod: ShippingMethod,
  currency_code: string
) => {
  if (shippingMethod.custom_amount && shippingMethod.custom_amount !== "") {
    const customAmount =
      typeof shippingMethod.custom_amount === "string"
        ? Number(shippingMethod.custom_amount.replace(",", "."))
        : shippingMethod.custom_amount

    return getDbAmount(customAmount, currency_code)
  }

  if (shippingMethod.amount) {
    return Number(shippingMethod.amount)
  }

  return 0
}
