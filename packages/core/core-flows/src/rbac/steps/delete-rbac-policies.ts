import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { IRbacModuleService } from "@medusajs/types"

/**
 * @ignore
 * @featureFlag rbac
 */
export type DeleteRbacPoliciesStepInput = string[]

/**
 * @ignore
 * @featureFlag rbac
 */
export const deleteRbacPoliciesStepId = "delete-rbac-policies"

/**
 * @ignore
 * @featureFlag rbac
 */
export const deleteRbacPoliciesStep = createStep(
  { name: deleteRbacPoliciesStepId, noCompensation: true },
  async (ids: DeleteRbacPoliciesStepInput, { container }) => {
    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    if (!ids?.length) {
      return new StepResponse([] as any, [])
    }

    const deleted = await service.deleteRbacPolicies(ids)

    return new StepResponse(deleted, ids)
  },
  async (deletedPoliciesIds, { container }) => {
    if (!deletedPoliciesIds?.length) {
      return
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    // Restore the soft-deleted roles during compensation
    await service.restoreRbacPolicies(deletedPoliciesIds)
  }
)
