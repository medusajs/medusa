import { definePolicies } from "@medusajs/framework/utils"
import { generateResourcePolicies } from "../utils"

const inventoryResources = [
  "inventory_item",
  "inventory_level",
  "reservation_item",
  "stock_location",
]

export const inventoryPolicies = definePolicies(
  generateResourcePolicies(inventoryResources)
)
