import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { CreateRbacRolePolicyDTO, IRbacModuleService } from "@medusajs/types"

/**
 * @since 2.22.4
 */
export type CreateRbacRolePoliciesStepInput = {
  policies: CreateRbacRolePolicyDTO[]
}

/**
 * @since 2.22.4
 */
export const createRbacRolePoliciesStepId = "create-rbac-role-policies"

/**
 * @since 2.22.4
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
