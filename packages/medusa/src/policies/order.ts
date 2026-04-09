import {
  definePolicies,
  PolicyDefinition,
  toPascalCase,
} from "@medusajs/framework/utils"
import { defaultPolicyOperations } from "../utils/default-policy-operations"

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

const policies: PolicyDefinition[] = []

for (const resource of orderResources) {
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

export const orderPolicies = definePolicies(policies)
