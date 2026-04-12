import { FileSystem } from "../common/file-system"
import { promiseAll } from "../common/promise-all"
import { Policy, PolicyOperation, PolicyResource } from "./define-policies"

/**
 * Generates TypeScript type definitions for RBAC Resource, Operation, and Policy.
 * Creates two files:
 * - "policy-types.d.ts" - Ambient type declarations with global types
 * - "policy-bindings.d.ts" - Module augmentation for @medusajs/framework/utils
 *
 * @param outputDir - Directory where the type definition files should be created
 */
export async function generatePolicyTypes({
  outputDir,
}: {
  outputDir: string
}) {
  const policyTypeEntries: string[] = []

  // Generate type entries for each named policy from Policy object
  for (const [name, { resource, operation }] of Object.entries(Policy)) {
    policyTypeEntries.push(
      `  ${name}: { resource: "${resource}"; operation: "${operation}" };`
    )
  }

  // If no policies are registered, create empty types
  const policyInterface =
    policyTypeEntries.length > 0
      ? `{\n${policyTypeEntries.join("\n")}\n}`
      : "{}"

  const fileSystem = new FileSystem(outputDir)

  const resourceKeys = Object.keys(PolicyResource).sort()
  const operationKeys = Object.keys(PolicyOperation).sort()

  // Generate PolicyResourceType entries
  const resourceTypeEntries = resourceKeys
    .map((key) => `  readonly ${key}: "${PolicyResource[key]}";`)
    .join("\n")

  // Generate PolicyOperationType entries
  const operationTypeEntries = operationKeys
    .map(
      (key) =>
        `  readonly ${key === "*" ? `"*"` : key}: "${PolicyOperation[key]}";`
    )
    .join("\n")

  // File 1: policy-types.d.ts - Ambient type declarations
  const policyTypesContents = `/**
 * RBAC Resource registry type
 */
type PolicyResourceType = {
${resourceTypeEntries}
};

/**
 * RBAC Operation registry type
 */
type PolicyOperationType = {
${operationTypeEntries}
};

/**
 * RBAC Policy registry type
 */
type PolicyType = ${policyInterface};

// Global declarations
declare const PolicyResource: PolicyResourceType;
declare const PolicyOperation: PolicyOperationType;
declare const Policy: PolicyType;
`

  // File 2: policy-bindings.d.ts - Module augmentation
  const policyBindingsContents = `/// <reference path="./policy-types.d.ts" />

// Module augmentation for @medusajs/framework/utils
// Types and globals are defined in policy-types.d.ts
declare module "@medusajs/framework/utils" {
  export const PolicyResource: PolicyResourceType;
  export const PolicyOperation: PolicyOperationType;
  export const Policy: PolicyType;
}

export {};
`

  await promiseAll([
    fileSystem.create("policy-types.d.ts", policyTypesContents),
    fileSystem.create("policy-bindings.d.ts", policyBindingsContents),
  ])
}
