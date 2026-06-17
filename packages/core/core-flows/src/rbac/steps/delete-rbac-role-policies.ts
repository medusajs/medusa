import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { IRbacModuleService } from "@medusajs/types"

/**
 * The IDs of the role-policy assignments to delete.
 */
export type DeleteRbacRolePoliciesStepInput = string[]

/**
 * @featureFlag rbac
 */
export const deleteRbacRolePoliciesStepId = "delete-rbac-role-policies"

/**
 * This step deletes one or more role-policy assignments, removing the associated
 * policies from their roles.
 *
 * @example
 * const data = deleteRbacRolePoliciesStep(["rolepol_123"])
 *
 * @featureFlag rbac
 */
export const deleteRbacRolePoliciesStep = createStep(
  { name: deleteRbacRolePoliciesStepId, noCompensation: true },
  async (ids: DeleteRbacRolePoliciesStepInput, { container }) => {
    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    if (!ids?.length) {
      return new StepResponse([] as any, [])
    }

    const deleted = await service.deleteRbacRolePolicies(ids)

    return new StepResponse(deleted, ids)
  },
  async (deletedRolePolicyIds, { container }) => {
    if (!deletedRolePolicyIds?.length) {
      return
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)
    await service.restoreRbacRolePolicies(deletedRolePolicyIds)
  }
)
