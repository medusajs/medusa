import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { CreateRbacRolePolicyDTO, IRbacModuleService } from "@medusajs/types"

/**
 * The input to create RBAC role policies.
 */
export type CreateRbacRolePoliciesStepInput = {
  /**
   * The role-policy assignments to create.
   */
  policies: CreateRbacRolePolicyDTO[]
}

/**
 * @featureFlag rbac
 */
export const createRbacRolePoliciesStepId = "create-rbac-role-policies"

/**
 * This step assigns one or more policies to roles by creating role-policy associations.
 *
 * @example
 * const data = createRbacRolePoliciesStep({
 *   policies: [
 *     {
 *       role_id: "role_123",
 *       policy_id: "pol_123"
 *     }
 *   ]
 * })
 *
 * @featureFlag rbac
 */
export const createRbacRolePoliciesStep = createStep(
  createRbacRolePoliciesStepId,
  async (data: CreateRbacRolePoliciesStepInput, { container }) => {
    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    if (!data.policies?.length) {
      return new StepResponse([], [])
    }

    const created = await service.createRbacRolePolicies(data.policies)

    return new StepResponse(
      created,
      (created ?? []).map((rp) => rp.id)
    )
  },
  async (createdIds: string[] | undefined, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)
    await service.deleteRbacRolePolicies(createdIds)
  }
)
