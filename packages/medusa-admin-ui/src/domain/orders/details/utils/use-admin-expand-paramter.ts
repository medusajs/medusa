import * as React from "react"
import { FeatureFlagContext } from "../../../../context/feature-flag"

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
