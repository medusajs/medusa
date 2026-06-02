import { definePolicies } from "@medusajs/framework/utils"
import { generateResourcePolicies } from "../utils"

const customerResources = ["customer", "customer_address", "customer_group"]

export const customerPolicies = definePolicies(
  generateResourcePolicies(customerResources)
)
