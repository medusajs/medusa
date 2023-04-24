import * as React from "react"
import { FeatureFlagContext } from "../../../../context/feature-flag"

const orderRelations = [
  "customer",
  "items",
  "items.tax_lines",
  "billing_address",
  "shipping_address",
  "discounts",
  "discounts.rule",
  "shipping_methods",
  "shipping_methods.tax_lines",
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
  const { isFeatureEnabled } = React.useContext(FeatureFlagContext)

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
