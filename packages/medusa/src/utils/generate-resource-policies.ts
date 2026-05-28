import { PolicyDefinition, toPascalCase } from "@medusajs/framework/utils"
import { defaultPolicyOperations } from "./default-policy-operations"

export const generateResourcePolicies = (resources: string[]) => {
  const policies: PolicyDefinition[] = []

  for (const resource of resources) {
    for (const operation of defaultPolicyOperations) {
      const policyName = toPascalCase(operation) + toPascalCase(resource)

      policies.push({
        name: policyName,
        resource: resource,
        operation: operation,
        description: `${toPascalCase(operation)} ${resource.replace(
          /_/g,
          " "
        )}`,
      })
    }
  }

  return policies
}
