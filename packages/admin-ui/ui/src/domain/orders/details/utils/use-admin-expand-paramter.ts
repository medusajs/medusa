import { useFeatureFlag } from "../../../../providers/feature-flag-provider"

const orderRelations = [
  "customer",
  "billing_address",
  "shipping_address",
  "discounts",
  "discounts.rule",
  "shipping_methods",
  "payments",
  "fulfillments",
  "fulfillments.tracking_links",
  "returns",
  "claims",
  "swaps",
  "swaps.return_order",
  "swaps.additional_items",
]

const useOrdersExpandParam = () => {
  const { isFeatureEnabled } = useFeatureFlag()
  const editsEnabled = isFeatureEnabled("order_editing")

  if (editsEnabled) {
    if (orderRelations.indexOf("edits") === -1) {
      orderRelations.push("edits")
    }
  }

  return {
    orderRelations: orderRelations.join(","),
  }
}

export default useOrdersExpandParam
