import { getActorPermissions, isGranted } from "@medusajs/framework"
import { MedusaContainer, RbacScope } from "@medusajs/framework/types"

/**
 * @ignore
 */
export type CanActorGrantPoliciesInput = {
  container: MedusaContainer
  actor_id: string
  actor?: string
  actions: { resource: string; operation: string }[]
  /**
   * The scope context the grant happens within. When provided, the granting
   * actor's unscoped assignments and those scoped to it are considered. When
   * omitted, only the granting actor's unscoped assignments are considered.
   */
  scope?: RbacScope
}

/**
 * Whether the actor's own roles grant every action in `actions`, optionally
 * evaluated within a scope context. An actor can only grant permissions they
 * themselves have.
 */
export const canActorGrantPolicies = async ({
  container,
  actor_id,
  actor,
  actions,
  scope,
}: CanActorGrantPoliciesInput): Promise<boolean> => {
  if (!actions.length) {
    return true
  }

  const permissions = await getActorPermissions({
    authContext: { actor_id, actor_type: actor ?? "user" },
    container,
    scope,
  })

  return actions.every((action) =>
    isGranted(permissions, action.resource, action.operation)
  )
}
