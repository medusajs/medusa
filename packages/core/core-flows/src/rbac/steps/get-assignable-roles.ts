import {
  isGranted,
  listRolePermissions,
  resolveRoles,
} from "@medusajs/framework"
import { RbacScope } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * @ignore
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
   * Server-derived scope context the assignability is evaluated within.
   * Omitted = the actor's full scope-union.
   */
  scope?: RbacScope
  /**
   * Optional filters forwarded to the `rbac_role` query (e.g. `q`, `id`).
   */
  filters?: Record<string, unknown>
  /**
   * Optional pagination applied to the assignable subset after permission resolution.
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
 * @since 2.16.0
 */
export type GetAssignableRolesStepOutput = {
  roles: AssignableRole[]
  count: number
}

/**
 * @ignore
 * @since 2.16.0
 */
export const getAssignableRolesStepId = "get-assignable-roles"

/**
 * Resolves the set of roles the actor is allowed to assign.
 *
 * @ignore
 * @since 2.16.0
 */
export const getAssignableRolesStep = createStep(
  getAssignableRolesStepId,
  async (
    data: GetAssignableRolesStepInput,
    { container }
  ): Promise<StepResponse<GetAssignableRolesStepOutput>> => {
    const { actor_id, actor, scope, filters, pagination } = data

    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const roleIds = await resolveRoles({
      authContext: { actor_id, actor_type: actor ?? "user" },
      container,
      scope,
    })

    if (!roleIds.length) {
      return new StepResponse({ roles: [], count: 0 })
    }

    // The actor's permissions are resolved once and every candidate role's
    // policies are checked against them. A role is assignable when the actor
    // holds all of its policies.
    const [permissions, { data: candidates }] = await Promise.all([
      listRolePermissions({ roles: roleIds, container }),
      query.graph({
        entity: "rbac_role",
        fields: [
          "id",
          "name",
          "description",
          "policies.resource",
          "policies.operation",
        ],
        filters: filters ?? {},
      }),
    ])
    const permissionSet = new Set(permissions)

    const assignable: AssignableRole[] = (candidates ?? [])
      .filter((role) =>
        (role.policies ?? []).every(
          (policy: any) =>
            policy.resource == null ||
            policy.operation == null ||
            isGranted(permissionSet, policy.resource, policy.operation)
        )
      )
      .map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description ?? null,
      }))

    const { skip = 0, take } = pagination ?? {}
    const page =
      typeof take === "number"
        ? assignable.slice(skip, skip + take)
        : assignable.slice(skip)

    return new StepResponse({ roles: page, count: assignable.length })
  }
)
