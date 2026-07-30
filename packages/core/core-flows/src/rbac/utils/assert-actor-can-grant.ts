import { hasPermission, resolveActorRoleIds } from "@medusajs/framework"
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
  scope?: RbacScope | RbacScope[]
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

  // TODO: The scope handling here is wrong and needs to be correctly
  // implemented. `scope` on the assign/unassign flows now carries the scope
  // constraint stored on the assignment itself, not the granting actor's
  // evaluation context, so evaluating the actor's privileges against it no
  // longer matches its meaning.
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
