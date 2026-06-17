import { definePolicies } from "@medusajs/framework/utils"
import { generateResourcePolicies } from "../utils"

const salesChannelResources = ["sales_channel"]

export const salesChannelPolicies = definePolicies(
  generateResourcePolicies(salesChannelResources)
)
