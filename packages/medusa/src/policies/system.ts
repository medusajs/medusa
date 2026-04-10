import {
  definePolicies,
  PolicyDefinition,
  toPascalCase,
} from "@medusajs/framework/utils"
import { defaultPolicyOperations } from "../utils/default-policy-operations"

const systemResources = [
  "file",
  "notification",
  "workflow_execution",
  "store",
  "store_locale",
]

const policies: PolicyDefinition[] = []

for (const resource of systemResources) {
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

export const systemPolicies = definePolicies(policies)
