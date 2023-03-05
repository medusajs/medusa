import { useFeatureFlag } from "../../../../providers/feature-flag-provider"

const orderRelations = [
  "customer",
  "billing_address",
  "shipping_address",
  "discounts",
  "discounts.rule",
  "shipping_methods",
  "payments",
  "items",
  "fulfillments",
  "fulfillments.tracking_links",
  "returns",
  "refunds",
  "claims",
  "claims.claim_items",
  "claims.claim_items.item",
  "claims.return_order",
  "claims.additional_items",
  "swaps",
  "swaps.return_order",
  "swaps.additional_items",
  "returnable_items",
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
