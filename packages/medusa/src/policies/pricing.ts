import { definePolicies } from "@medusajs/framework/utils"
import { generateResourcePolicies } from "../utils"

const pricingResources = ["price_list", "price_preference", "price", "currency"]

export const pricingPolicies = definePolicies(
  generateResourcePolicies(pricingResources)
)
