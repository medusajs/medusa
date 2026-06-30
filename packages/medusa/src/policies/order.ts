import { definePolicies } from "@medusajs/framework/utils"
import { generateResourcePolicies } from "../utils"

const orderResources = [
  "order",
  "order_item",
  "order_change",
  "order_claim",
  "order_claim_item",
  "order_exchange",
  "return",
  "return_reason",
]

export const orderPolicies = definePolicies(
  generateResourcePolicies(orderResources)
)
