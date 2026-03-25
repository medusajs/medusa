import {
  definePolicies,
  PolicyDefinition,
  toPascalCase,
} from "@medusajs/framework/utils"
import { defaultPolicyOperations } from "../utils/default-policy-operations"

const regionResources = ["region"]

const policies: PolicyDefinition[] = []

for (const resource of regionResources) {
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

export const regionPolicies = definePolicies(policies)
