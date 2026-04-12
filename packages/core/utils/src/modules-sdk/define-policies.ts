import { getCallerFilePath, isFileDisabled, MEDUSA_SKIP_FILE } from "../common"
import { toSnakeCase } from "../common/to-snake-case"

export const MedusaPolicySymbol = Symbol.for("MedusaPolicy")

export interface PolicyDefinition {
  name: string
  resource: string
  operation: string
  description?: string
}

export interface definePoliciesExport {
  [MedusaPolicySymbol]: boolean
  policies: PolicyDefinition[]
}

// This will be overridden by the actual interface when medusa types are loaded
type DefaultPolicyResources = Record<string, string>

/**
 * Global registry for all unique resources.
 */
const PolicyResource: DefaultPolicyResources & Record<string, string> =
  global.PolicyResource ?? {}

global.PolicyResource ??= PolicyResource

/**
 * Global registry for all unique operations.
 */
const defaultOperations = ["read", "create", "update", "delete", "*"]

const PolicyOperation: Record<string, string> & {
  readonly read: "read"
  readonly create: "create"
  readonly update: "update"
  readonly delete: "delete"
  readonly "*": "*"
  readonly ALL: "*"
} = global.PolicyOperation ?? { ALL: "*" }

for (const operation of defaultOperations) {
  const operationKey = operation === "*" ? "*" : toSnakeCase(operation)
  PolicyOperation[operationKey] = operation
}

global.PolicyOperation ??= PolicyOperation

const Policy: Record<
  string,
  { resource: string; operation: string; description?: string }
> = global.Policy ?? {}

global.Policy ??= Policy

/**
 * Define RBAC policies that will be automatically synced to the database
 * when the application starts.
 *
 * @param policies - Single policy or array of policy definitions
 *
 * @example
 * ```ts
 * definePolicies({
 *   name: "ReadBrands",
 *   resource: "brand",
 *   operation: "read"
 *   description: "Read brands"
 * })
 *
 * definePolicies([
 *   {
 *     name: "ReadBrands",
 *     resource: "brand",
 *     operation: "read"
 *   },
 *   {
 *     name: "CreateBrands",
 *     resource: "brand",
 *     operation: "create"
 *   }
 * ])
 * ```
 */
export function definePolicies(
  policies: PolicyDefinition | PolicyDefinition[]
): definePoliciesExport {
  const callerFilePath = getCallerFilePath()
  if (isFileDisabled(callerFilePath ?? "")) {
    return { [MEDUSA_SKIP_FILE]: true } as any
  }

  const policiesArray = Array.isArray(policies) ? policies : [policies]

  for (const policy of policiesArray) {
    if (!policy.name || !policy.resource || !policy.operation) {
      throw new Error(
        `Policy definition must include name, resource, and operation. Received: ${JSON.stringify(
          policy,
          null,
          2
        )}`
      )
    }
  }

  for (const policy of policiesArray) {
    const resourceKey =
      policy.resource === "*" ? "*" : toSnakeCase(policy.resource)
    const operationKey =
      policy.operation === "*" ? "*" : toSnakeCase(policy.operation)

    policy.resource = resourceKey
    policy.operation = operationKey

    PolicyResource[resourceKey] = policy.resource

    PolicyOperation[operationKey] = policy.operation

    // Register in Policy object with name as key
    Policy[policy.name] = { ...policy }
  }

  const output: definePoliciesExport = {
    [MedusaPolicySymbol]: true,
    policies: policiesArray,
  }

  return output
}

export { Policy, PolicyOperation, PolicyResource }
