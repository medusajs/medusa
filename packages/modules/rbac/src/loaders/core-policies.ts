import {
  InferEntityType,
  LoaderOptions,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import { RbacPolicy } from "@models"
import { CORE_POLICY_DEFINITIONS } from "./core-policy-definitions"

/**
 * Syncs Medusa's predefined core policies on every boot, so that an
 * accidentally removed core policy self-heals on restart: missing rows are
 * created, soft-deleted rows are restored and drifted names/descriptions are
 * updated.
 *
 * Rows are matched by `key`, never by id, so databases seeded by an earlier
 * Medusa version are reused as-is. Policies created at runtime are never
 * touched, and nothing is ever deleted.
 */
export default async ({
  container,
}: LoaderOptions<
  | ModulesSdkTypes.ModuleServiceInitializeOptions
  | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
>): Promise<void> => {
  const rbacPolicyService = container.resolve(
    "rbacPolicyService"
  ) as ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof RbacPolicy>
  >

  const existingPolicies = await rbacPolicyService.list(
    {},
    { withDeleted: true }
  )

  const existingPoliciesByKey = new Map(
    existingPolicies.map((policy) => [policy.key, policy])
  )

  const policiesToCreate: typeof CORE_POLICY_DEFINITIONS = []
  const policiesToUpdate: {
    id: string
    name: string
    description: string
  }[] = []
  const policiesToRestore: string[] = []

  for (const definition of CORE_POLICY_DEFINITIONS) {
    const existing = existingPoliciesByKey.get(definition.key)

    if (!existing) {
      policiesToCreate.push(definition)
      continue
    }

    if (existing.deleted_at) {
      policiesToRestore.push(existing.id)
    }

    const hasChanges =
      existing.name !== definition.name ||
      existing.description !== definition.description

    if (hasChanges) {
      policiesToUpdate.push({
        id: existing.id,
        name: definition.name,
        description: definition.description,
      })
    }
  }

  if (policiesToRestore.length > 0) {
    await rbacPolicyService.restore(policiesToRestore)
  }

  if (policiesToCreate.length > 0) {
    await rbacPolicyService.create(policiesToCreate)
  }

  if (policiesToUpdate.length > 0) {
    await rbacPolicyService.upsert(policiesToUpdate)
  }
}
