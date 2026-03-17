import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * @ignore
 * @featureFlag rbac
 */
export type ValidateUserRolePermissionsStepInput = {
  actor_id: string
  actor?: string
  role_ids: string[]
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const validateUserRolePermissionsStepId =
  "validate-user-role-permissions"

/**
 * Validates that the actor has all the policies from the roles being assigned.
 * A user can only assign roles whose policies they themselves have.
 * @ignore
 * @featureFlag rbac
 */
export const validateUserRolePermissionsStep = createStep(
  validateUserRolePermissionsStepId,
  async (data: ValidateUserRolePermissionsStepInput, { container }) => {
    const { actor_id, actor, role_ids } = data

    if (!role_ids?.length) {
      return new StepResponse(void 0)
    }

    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const { data: roles } = await query.graph({
      entity: "rbac_role",
      fields: ["id", "policies.id"],
      filters: { id: role_ids },
    })

    const targetPolicyIds = new Set<string>()
    roles.forEach((role: any) => {
      role.policies?.forEach((policy: any) => {
        targetPolicyIds.add(policy.id)
      })
    })

    if (targetPolicyIds.size === 0) {
      return new StepResponse(void 0)
    }

    const { data: actors } = await query.graph({
      entity: actor ?? "user",
      fields: ["rbac_roles.id", "rbac_roles.policies.id"],
      filters: { id: actor_id },
    })

    if (!actors?.[0]?.rbac_roles?.length) {
      throw new MedusaError(
        MedusaError.Types.FORBIDDEN,
        "You do not have permission to assign these roles"
      )
    }

    const actorPolicyIds = new Set<string>()
    actors[0].rbac_roles.forEach((role: any) => {
      role.policies?.forEach((policy: any) => {
        actorPolicyIds.add(policy.id)
      })
    })

    const missingPolicies: string[] = []
    targetPolicyIds.forEach((policyId) => {
      if (!actorPolicyIds.has(policyId)) {
        missingPolicies.push(policyId)
      }
    })

    if (missingPolicies.length > 0) {
      throw new MedusaError(
        MedusaError.Types.FORBIDDEN,
        "You do not have permission to assign these roles"
      )
    }

    return new StepResponse(void 0)
  }
)
