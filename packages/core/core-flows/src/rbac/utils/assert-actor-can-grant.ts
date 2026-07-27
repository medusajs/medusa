import { hasPermission, resolveActorRoleIds } from "@medusajs/framework"
import { MedusaContainer } from "@medusajs/framework/types"
import { MedusaError, RbacScopeRef } from "@medusajs/framework/utils"

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
   * it: unscoped roles always count, scoped roles only when their scope is in
   * the set. When omitted, privileges are evaluated across the actor's full
   * scope-union policies.
   *
   * Must be derived server-side (e.g. the request's resolved scope set), never
   * from an arbitrary client claim.
   */
  scope?: RbacScopeRef | RbacScopeRef[]
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

  const actorRoleIds = await resolveActorRoleIds({
    actorType: actor ?? "user",
    actorId: actor_id,
    container,
    scope,
  })

  if (!actorRoleIds.length) {
    throw new MedusaError(MedusaError.Types.FORBIDDEN, errorMessage)
  }

  const allowed = await hasPermission({
    roles: actorRoleIds,
    actions,
    container,
  })

  if (!allowed) {
    throw new MedusaError(MedusaError.Types.FORBIDDEN, errorMessage)
  }
}
