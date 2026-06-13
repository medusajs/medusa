import { hasPermission } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * @ignore
 * @featureFlag rbac
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
 * @ignore
 * @featureFlag rbac
 * @since 2.16.0
 */
export type GetAssignableRolesStepOutput = {
  roles: AssignableRole[]
  count: number
}

/**
 * @ignore
 * @featureFlag rbac
 * @since 2.16.0
 */
export const getAssignableRolesStepId = "get-assignable-roles"

/**
 * Resolves the set of roles the actor is allowed to assign.
 *
 * @ignore
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
