import { resolveActorRoleIds, resolvePermissions } from "@medusajs/framework"
import { RbacScope } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * @ignore
 * @featureFlag rbac
 * @since 2.16.0
 */
export type GetAssignablePoliciesStepInput = {
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
  scope?: RbacScope | RbacScope[]
  /**
   * Optional filters forwarded to the `rbac_policy` query (e.g. `q`, `id`, `resource`, `operation`).
   */
  filters?: Record<string, unknown>
  /**
   * Optional pagination applied to the assignable subset after permission resolution.
   */
  pagination?: { skip?: number; take?: number }
}

type AssignablePolicy = {
  id: string
  key: string
  resource: string
  operation: string
  description: string | null
}

/**
 * @ignore
 * @featureFlag rbac
 * @since 2.16.0
 */
export type GetAssignablePoliciesStepOutput = {
  policies: AssignablePolicy[]
  count: number
}

/**
 * @ignore
 * @featureFlag rbac
 * @since 2.16.0
 */
export const getAssignablePoliciesStepId = "get-assignable-policies"

/**
 * Resolves the set of policies the actor is allowed to assign.
 *
 * @ignore
 * @featureFlag rbac
 * @since 2.16.0
 */
export const getAssignablePoliciesStep = createStep(
  getAssignablePoliciesStepId,
  async (
    data: GetAssignablePoliciesStepInput,
    { container }
  ): Promise<StepResponse<GetAssignablePoliciesStepOutput>> => {
    const { actor_id, actor, scope, filters, pagination } = data

    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const actorRoleIds = await resolveActorRoleIds({
      actorType: actor ?? "user",
      actorId: actor_id,
      container,
      scope,
    })

    if (!actorRoleIds.length) {
      return new StepResponse({ policies: [], count: 0 })
    }

    const { data: candidates } = await query.graph({
      entity: "rbac_policy",
      fields: ["id", "key", "resource", "operation", "description"],
      filters: {
        ...(filters ?? {}),
        resource: { $ne: null },
        operation: { $ne: null },
      },
    })

    const granted = await resolvePermissions({
      roles: actorRoleIds,
      universe: (candidates ?? []).map((p: any) => ({
        resource: p.resource as string,
        operation: p.operation as string,
      })),
      container,
    })

    const assignable: AssignablePolicy[] = []
    for (const policy of candidates ?? []) {
      if (granted.has(`${policy.resource}:${policy.operation}`)) {
        assignable.push({
          id: policy.id,
          key: policy.key,
          resource: policy.resource,
          operation: policy.operation,
          description: policy.description ?? null,
        })
      }
    }

    const { skip = 0, take } = pagination ?? {}
    const page =
      typeof take === "number"
        ? assignable.slice(skip, skip + take)
        : assignable.slice(skip)

    return new StepResponse({ policies: page, count: assignable.length })
  }
)
