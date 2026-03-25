import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { CreateRbacRolePolicyDTO, IRbacModuleService } from "@medusajs/types"

/**
 * @ignore
 * @featureFlag rbac
 */
export type CreateRbacRolePoliciesStepInput = {
  policies: CreateRbacRolePolicyDTO[]
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const createRbacRolePoliciesStepId = "create-rbac-role-policies"

/**
 * @ignore
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
