import {
  getSelectsAndRelationsFromObjectArray,
  Modules,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { IRbacModuleService, UpdateRbacRolePolicyDTO } from "@medusajs/types"

/**
 * The input to update RBAC role policies.
 */
export type UpdateRbacRolePoliciesStepInput = {
  /**
   * The filters to select the role-policy assignments to update.
   */
  selector: Record<string, any>
  /**
   * The data to update in the selected role-policy assignments.
   */
  update: Omit<UpdateRbacRolePolicyDTO, "id">
}

/**
 * @featureFlag rbac
 */
export const updateRbacRolePoliciesStepId = "update-rbac-role-policies"

/**
 * This step updates the role-policy assignments matching the specified filters.
 *
 * @example
 * const data = updateRbacRolePoliciesStep({
 *   selector: {
 *     role_id: "role_123"
 *   },
 *   update: {
 *     policy_id: "pol_456"
 *   }
 * })
 *
 * @featureFlag rbac
 */
export const updateRbacRolePoliciesStep = createStep(
  updateRbacRolePoliciesStepId,
  async (data: UpdateRbacRolePoliciesStepInput, { container }) => {
    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.listRbacRolePolicies(data.selector, {
      select: selects,
      relations,
    })

    const updates = (prevData ?? []).map((rp) => ({
      id: rp.id,
      ...data.update,
    })) as UpdateRbacRolePolicyDTO[]

    const updated = await service.updateRbacRolePolicies(updates)

    return new StepResponse(updated, {
      prevData,
      updateKeys: Object.keys(data.update ?? {}),
    })
  },
  async (
    compensationData: { prevData: any[]; updateKeys: string[] } | undefined,
    { container }
  ) => {
    if (!compensationData?.prevData?.length) {
      return
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    const updates = compensationData.prevData.map((rp) => {
      const payload: Record<string, any> = { id: rp.id }
      for (const key of compensationData.updateKeys) {
        payload[key] = rp[key]
      }
      return payload
    }) as UpdateRbacRolePolicyDTO[]

    await service.updateRbacRolePolicies(updates)
  }
)
