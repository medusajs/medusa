import { OrderChangeActionDTO } from "@medusajs/framework/types"
import { isDefined } from "@medusajs/framework/utils"

export function prepareShippingMethod(relatedEntityField?: string) {
  return function (data) {
    const option = data.shippingOptions[0]
    const orderChange = data.orderChange

    const isCustomPrice = isDefined(data.customPrice)
    const obj = {
      shipping_option_id: option.id,
      amount: isCustomPrice
        ? data.customPrice
        : option.calculated_price.calculated_amount,
      is_custom_amount: isCustomPrice,
      is_tax_inclusive:
        !!option.calculated_price.is_calculated_price_tax_inclusive,
      data: option.data ?? {},
      name: option.name,
      version: orderChange.version,
      order_id: data.relatedEntity.order_id,
    } as any

    if (relatedEntityField) {
      obj.return_id = data.input.return_id
      obj[relatedEntityField] = data.relatedEntity.id

      if (relatedEntityField === "return_id") {
        obj.claim_id = data.relatedEntity.claim_id
        obj.exchange_id = data.relatedEntity.exchange_id
      }
    }

    return obj
  }
}

export function prepareShippingMethodUpdate({
  input,
  orderChange,
  shippingOptions,
}) {
  const originalAction = (orderChange.actions ?? []).find(
    (a) => a.id === input.action_id
  ) as OrderChangeActionDTO

  const data = input.data

  const option = shippingOptions?.[0]

  const isCustomPrice = !isDefined(shippingOptions)
  const price = isCustomPrice
    ? data.custom_amount
    : option.calculated_price.calculated_amount

  const action = {
    id: originalAction.id,
    amount: price,
    internal_note: data.internal_note,
  }

  const shippingMethod = {
    id: originalAction.reference_id,
    amount: price,
    is_custom_amount: isCustomPrice,
    metadata: data.metadata,
  }

  return {
    action,
    shippingMethod,
  }
}
