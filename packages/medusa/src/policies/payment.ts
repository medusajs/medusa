import {
  definePolicies,
  PolicyDefinition,
  toPascalCase,
} from "@medusajs/framework/utils"
import { defaultPolicyOperations } from "../utils/default-policy-operations"

const paymentResources = [
  "payment",
  "payment_collection",
  "payment_method",
  "payment_session",
  "refund_reason",
]

const policies: PolicyDefinition[] = []

for (const resource of paymentResources) {
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

export const paymentPolicies = definePolicies(policies)
