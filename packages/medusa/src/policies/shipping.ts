import {
  definePolicies,
  PolicyDefinition,
  toPascalCase,
} from "@medusajs/framework/utils"
import { defaultPolicyOperations } from "../utils/default-policy-operations"

const shippingResources = [
  "shipping_option",
  "shipping_option_type",
  "shipping_profile",
  "fulfillment",
  "fulfillment_provider",
  "fulfillment_set",
]

const policies: PolicyDefinition[] = []

for (const resource of shippingResources) {
  for (const operation of defaultPolicyOperations) {
    const policyName = toPascalCase(operation) + toPascalCase(resource)

    policies.push({
      name: policyName,
      resource: resource,
      operation: operation,
      description: `${toPascalCase(operation)} ${resource.replace(/_/g, " ")}`,
    })
  }
}

export const shippingPolicies = definePolicies(policies)
