import {
  CreateRbacPolicyDTO,
  PolicyOperationValue,
  PolicyResourceValue,
} from "@medusajs/types"
import { MedusaError, toPascalCase } from "../common"
import { CORE_POLICY_OPERATIONS } from "./policy-operations"

/**
 * Builds policies for a list of resources. Every policy is derived, so `key`,
 * `name` and `description` cannot be given.
 */
export type BuildPoliciesForResourcesInput = {
  /**
   * The resources to build policies for.
   */
  resource: readonly PolicyResourceValue[]
  /**
   * The operation(s) to build a policy per resource for. Defaults to the core
   * operations ({@link CORE_POLICY_OPERATIONS}).
   */
  operation?: PolicyOperationValue | readonly PolicyOperationValue[]
  key?: never
  name?: never
  description?: never
}

/**
 * Builds policies for a single resource, where the derived `key`, `name` and
 * `description` can be overridden.
 */
export type BuildPoliciesForResourceInput = {
  /**
   * The resource to build policies for.
   */
  resource: PolicyResourceValue
  /**
   * The operation(s) to build a policy for. Defaults to the core operations
   * ({@link CORE_POLICY_OPERATIONS}).
   */
  operation?: PolicyOperationValue | readonly PolicyOperationValue[]
  /**
   * The policy's unique key. Defaults to `{resource}:{operation}`. Only
   * allowed when a single operation is built, since keys must be unique.
   */
  key?: string
  /**
   * The policy's name. Defaults to `{Operation}{Resource}` (e.g.
   * `ReadBrand`).
   */
  name?: string
  /**
   * The policy's description. Defaults to `{Operation} {Resource}` (e.g.
   * `Read brand`).
   */
  description?: string
}

export type BuildPoliciesInput =
  | BuildPoliciesForResourcesInput
  | BuildPoliciesForResourceInput

export type BuiltPolicy = CreateRbacPolicyDTO & {
  name: string
  description: string
}

/**
 * Expands resources into RBAC policy payloads, one per `(resource, operation)`
 * pair.
 *
 * ```ts
 * const policies = buildPolicies({ resource: ["brand", "brand_asset"] })
 * // => ReadBrand, CreateBrand, ... , DeleteBrandAsset (8 policies)
 *
 * await createRbacPoliciesWorkflow(container).run({ input: { policies } })
 * ```
 *
 * Pass a single resource to override the derived `key`, `name` or
 * `description`:
 *
 * ```ts
 * buildPolicies({
 *   resource: "brand",
 *   operation: "approve",
 *   name: "ApproveBrand",
 *   description: "Approve a brand before it goes live",
 * })
 * ```
 */
export function buildPolicies(
  input: BuildPoliciesForResourcesInput
): BuiltPolicy[]
export function buildPolicies(
  input: BuildPoliciesForResourceInput
): BuiltPolicy[]
export function buildPolicies({
  resource,
  operation,
  key,
  name,
  description,
}: BuildPoliciesInput): BuiltPolicy[] {
  const resources = Array.isArray(resource) ? resource : [resource]
  const operations = operation
    ? Array.isArray(operation)
      ? operation
      : [operation]
    : CORE_POLICY_OPERATIONS

  if (key && resources.length * operations.length > 1) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "A custom policy key can only be provided when building a single policy, as keys must be unique"
    )
  }

  return resources.flatMap((resource) => {
    const normalizedResource = toPascalCase(resource)

    return operations.map((operation) => {
      const normalizedOperation = toPascalCase(operation)

      return {
        key: key ?? `${resource}:${operation}`,
        resource,
        operation,
        name: name ?? `${normalizedOperation}${normalizedResource}`,
        description:
          description ??
          `${normalizedOperation} ${normalizedResource.replace(/_/g, " ")}`,
      }
    })
  })
}
