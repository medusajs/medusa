import {
  MedusaError,
  Modules,
  RBAC_SUPER_ADMIN_POLICY_ID,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { IRbacModuleService } from "@medusajs/types"

/**
 * @ignore
 */
export type DeleteRbacPoliciesStepInput = string[]

/**
 * This step deletes one or more RBAC policies. The built-in super admin policy
 * can't be deleted.
 * @ignore
 */
export const deleteRbacPoliciesStepId = "delete-rbac-policies"

/**
 * @ignore
 */
export const deleteRbacPoliciesStep = createStep(
  { name: deleteRbacPoliciesStepId, noCompensation: true },
  async (ids: DeleteRbacPoliciesStepInput, { container }) => {
    if (!ids?.length) {
      return new StepResponse([] as any, [])
    }

    if (ids.includes(RBAC_SUPER_ADMIN_POLICY_ID)) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "The super admin policy can't be deleted"
      )
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

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
