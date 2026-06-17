import { hasPermission } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The input to retrieve the roles an actor can assign.
 *
 * @since 2.16.0
 */
export type GetAssignableRolesStepInput = {
  /**
   * Actor ID whose assignability is evaluated.
   */
  actor_id: string
  /**
   * Actor entity name. Defaults to "user".
   */
  actor?: string
  /**
   * Optional filters forwarded to the `rbac_role` query (e.g. `q`, `id`).
   */
  filters?: Record<string, unknown>
  /**
   * Optional pagination forwarded to the `rbac_role` query.
   */
  pagination?: { skip?: number; take?: number }
}

type AssignableRole = {
  id: string
  name: string
  description: string | null
}

/**
 * The roles the actor can assign and their total count.
 *
 * @since 2.16.0
 */
export type GetAssignableRolesStepOutput = {
  /**
   * The roles the actor is allowed to assign.
   */
  roles: AssignableRole[]
  /**
   * The number of assignable roles.
   */
  count: number
}

/**
 * @featureFlag rbac
 * @since 2.16.0
 */
export const getAssignableRolesStepId = "get-assignable-roles"

/**
 * This step resolves the set of roles that the actor is allowed to assign. For each
 * candidate role, it checks whether the actor's own roles grant access to all of the
 * role's policies, and only returns the roles the actor has full access to.
 *
 * @example
 * const data = getAssignableRolesStep({
 *   actor_id: "user_123"
 * })
 *
 * @featureFlag rbac
 * @since 2.16.0
 */
export const getAssignableRolesStep = createStep(
  getAssignableRolesStepId,
  async (
    data: GetAssignableRolesStepInput,
    { container }
  ): Promise<StepResponse<GetAssignableRolesStepOutput>> => {
    const { actor_id, actor, filters, pagination } = data

    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const { data: actors } = await query.graph({
      entity: actor ?? "user",
      fields: ["rbac_roles.id"],
      filters: { id: actor_id },
    })

    const actorRoleIds: string[] =
      actors?.[0]?.rbac_roles?.map((r: any) => r.id).filter(Boolean) ?? []

    if (!actorRoleIds.length) {
      return new StepResponse({ roles: [], count: 0 })
    }

    const { data: candidates } = await query.graph({
      entity: "rbac_role",
      fields: [
        "id",
        "name",
        "description",
        "policies.resource",
        "policies.operation",
      ],
      filters: filters ?? {},
      pagination: pagination ?? {},
    })

    const assignable: AssignableRole[] = []

    for (const role of candidates ?? []) {
      const actions = (role.policies ?? []).filter(
        (p: any) => p.resource != null && p.operation != null
      )

      const allowed = await hasPermission({
        roles: actorRoleIds,
        actions,
        container,
      })

      if (allowed) {
        assignable.push({
          id: role.id,
          name: role.name,
          description: role.description ?? null,
        })
      }
    }

    return new StepResponse({ roles: assignable, count: assignable.length })
  }
)
