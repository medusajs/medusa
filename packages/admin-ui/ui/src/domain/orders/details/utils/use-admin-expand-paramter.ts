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
  "returns.shipping_method",
  "returns.shipping_method.tax_lines",
  "refunds",
  "claims",
  "claims.claim_items",
  "claims.claim_items.item",
  "claims.fulfillments",
  "claims.return_order",
  "claims.additional_items",
  "claims.additional_items.variant",
  "claims.additional_items.variant.product",
  "swaps",
  "swaps.return_order",
  "swaps.additional_items",
  "swaps.additional_items.variant",
  "swaps.additional_items.variant.product",
  "swaps.fulfillments",
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
