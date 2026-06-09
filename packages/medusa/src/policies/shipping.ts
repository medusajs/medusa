import { definePolicies } from "@medusajs/framework/utils"
import { generateResourcePolicies } from "../utils"

const shippingResources = [
  "shipping_option",
  "shipping_option_type",
  "shipping_profile",
  "fulfillment",
  "fulfillment_provider",
  "fulfillment_set",
  "service_zone",
]

export const shippingPolicies = definePolicies(
  generateResourcePolicies(shippingResources)
)
