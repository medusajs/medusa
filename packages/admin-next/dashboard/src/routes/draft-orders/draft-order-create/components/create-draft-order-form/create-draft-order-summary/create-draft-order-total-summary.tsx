import { Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Divider } from "../../../../../../components/common/divider"
import { castNumber } from "../../../../../../lib/cast-number"
import {
  getDbAmount,
  getLocaleAmount,
  getStylizedAmount,
} from "../../../../../../lib/money-amount-helpers"
import { useCreateDraftOrder } from "../hooks"
import { CustomItem, ExistingItem, ShippingMethod } from "../types"

export const CreateDraftOrderTotalSummary = () => {
  const { t } = useTranslation()
  const { form, region } = useCreateDraftOrder()
  const { currency_code } = region || {}

  const variantItems = form.getValues("existing_items") || []
  const variantItemsSubtotal = variantItems.reduce((acc, item) => {
    const amount = getExistingItemSubtotal(item, currency_code!)

    return (acc += amount)
  }, 0)

  const customItems = form.getValues("custom_items") || []
  const customItemsSubtotal = customItems.reduce((acc, item) => {
    const amount = getCustomItemSubtotal(item, currency_code!)

    return (acc += amount)
  }, 0)

  const count = variantItems.length + customItems.length
  const subtotal = variantItemsSubtotal + customItemsSubtotal

  const shippingMethod = form.getValues("shipping_method")
  const shippingSubtotal = getShippingSubtotal(shippingMethod, currency_code!)

  const total = subtotal + shippingSubtotal

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
                  castNumber(shippingMethod.amount || 0),
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
      <Divider variant="dashed" />
      <div className="grid grid-cols-2 gap-4">
        <Text size="small" leading="compact">
          {t("fields.totalExclTax")}
        </Text>
        <Text size="small" leading="compact" className="text-right">
          {getStylizedAmount(total, currency_code!)}
        </Text>
      </div>
    </div>
  )
}

const getExistingItemSubtotal = (item: ExistingItem, currency_code: string) => {
  if (item.custom_unit_price) {
    const customUnitPrice = castNumber(item.custom_unit_price)
    return getDbAmount(customUnitPrice, currency_code) * item.quantity
  }

  return item.unit_price * item.quantity
}

const getCustomItemSubtotal = (item: CustomItem, currency_code: string) => {
  return getDbAmount(castNumber(item.unit_price), currency_code) * item.quantity
}

const getShippingSubtotal = (
  shippingMethod: ShippingMethod,
  currency_code: string
) => {
  if (shippingMethod.custom_amount) {
    const customAmount = castNumber(shippingMethod.custom_amount)
    return getDbAmount(customAmount, currency_code)
  }

  if (shippingMethod.amount) {
    const amount =
      typeof shippingMethod.amount === "string"
        ? Number(shippingMethod.amount.replace(",", "."))
        : shippingMethod.amount

    return amount
  }

  return 0
}
