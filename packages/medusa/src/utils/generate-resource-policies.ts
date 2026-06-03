import { PolicyDefinition, toPascalCase } from "@medusajs/framework/utils"
import { defaultPolicyOperations } from "./default-policy-operations"

export const generateResourcePolicies = (resources: string[]) => {
  const policies: PolicyDefinition[] = []

  for (const resource of resources) {
    const normalizedResource = toPascalCase(resource)

    for (const operation of defaultPolicyOperations) {
      const normalizedOperation = toPascalCase(operation)
      const policyName = normalizedOperation + normalizedResource

      policies.push({
        name: policyName,
        resource: resource,
        operation: operation,
        description: `${normalizedOperation} ${normalizedResource.replace(
          /_/g,
          " "
        )}`,
      })
    }
  }

  return policies
}
