import { hasPermission } from "@medusajs/framework"
import { MedusaContainer } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"

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
}

/**
 * Asserts that the actor's own roles grant every action in `actions`.
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
}: AssertActorCanGrantInput): Promise<void> => {
  if (!actions.length) {
    return
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: actors } = await query.graph({
    entity: actor ?? "user",
    fields: ["rbac_roles.id"],
    filters: { id: actor_id },
  })

  const actorRoleIds: string[] =
    actors?.[0]?.rbac_roles?.map((r: { id: string }) => r.id).filter(Boolean) ??
    []

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
