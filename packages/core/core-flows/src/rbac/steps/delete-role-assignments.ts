import { IRbacModuleService } from "@medusajs/framework/types"
import { FeatureFlag, Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * @ignore
 * @featureFlag rbac
 */
export type DeleteRoleAssignmentsStepInput = {
  id: string | string[]
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const deleteRoleAssignmentsStepId = "delete-role-assignments"

/**
 * This step hard-deletes the RBAC role assignments matching the given filters
 * and invalidates the cached resolved-roles entries of the affected reference
 * entities.
 *
 * @ignore
 * @featureFlag rbac
 */
export const deleteRoleAssignmentsStep = createStep(
  deleteRoleAssignmentsStepId,
  async (input: DeleteRoleAssignmentsStepInput, { container }) => {
    const normalizedIds = Array.isArray(input.id) ? input.id : [input.id]

    if (!normalizedIds.length || !FeatureFlag.isFeatureEnabled("rbac")) {
      return new StepResponse([], [])
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    const existing = await service.listRbacRoleAssignments({
      id: normalizedIds,
    })

    if (!existing.length) {
      return new StepResponse([], [])
    }

    await service.deleteRbacRoleAssignments(normalizedIds)

    return new StepResponse(void 0, existing)
  },
  async (existing, { container }) => {
    if (!existing?.length) {
      return
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    await service.createRbacRoleAssignments(existing)
  }
)
