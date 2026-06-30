import { definePolicies } from "@medusajs/framework/utils"
import { generateResourcePolicies } from "../utils"

const taxResources = ["tax_provider", "tax_rate", "tax_region"]

export const taxPolicies = definePolicies(
  generateResourcePolicies(taxResources)
)
