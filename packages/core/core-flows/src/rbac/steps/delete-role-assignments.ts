import { IRbacModuleService } from "@medusajs/framework/types"
import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * @since 2.22.4
 */
export type DeleteRoleAssignmentsStepInput = {
  id: string | string[]
}

/**
 * @since 2.22.4
 */
export const deleteRoleAssignmentsStepId = "delete-role-assignments"

/**
 * This step hard-deletes the RBAC role assignments with the given IDs.
 *
 * @since 2.22.4
 */
export const deleteRoleAssignmentsStep = createStep(
  deleteRoleAssignmentsStepId,
  async (input: DeleteRoleAssignmentsStepInput, { container }) => {
    const normalizedIds = Array.isArray(input.id) ? input.id : [input.id]

    if (!normalizedIds.length || !MedusaModule.isInstalled(Modules.RBAC)) {
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
