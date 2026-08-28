import { hasPermission, resolveRoles } from "@medusajs/framework"
import { MedusaContainer } from "@medusajs/framework/types"
import { RbacScope } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"

/**
 * @ignore
 * @featureFlag rbac
 */
export type AssertActorCanGrantInput = {
  container: MedusaContainer
  actor_id: string
  actor?: string
  actions: { resource: string; operation: string }[]
  errorMessage: string
  /**
   * The scope context the grant happens within. When provided (including an
   * empty set), the granting actor's privileges are evaluated strictly within
   * it. When omitted, privileges are evaluated across the actor's full
   * scope-union policies.
   */
  scope?: RbacScope
}

/**
 * Asserts that the actor's own roles grant every action in `actions`,
 * optionally evaluated within a scope context.
 * An actor can only grant permissions they themselves have.
 * @ignore
 * @featureFlag rbac
 */
export const assertActorCanGrant = async ({
  container,
  actor_id,
  actor,
  actions,
  errorMessage,
  scope,
}: AssertActorCanGrantInput): Promise<void> => {
  if (!actions.length) {
    return
  }

  const roleIds = await resolveRoles({
    authContext: { actor_id, actor_type: actor ?? "user" },
    container,
    scope,
  })

  if (!roleIds.length) {
    throw new MedusaError(MedusaError.Types.FORBIDDEN, errorMessage)
  }

  const allowed = await hasPermission({
    roles: roleIds,
    actions,
    container,
  })

  if (!allowed) {
    throw new MedusaError(MedusaError.Types.FORBIDDEN, errorMessage)
  }
}
