import { resolvePermissions } from "@medusajs/framework"
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
