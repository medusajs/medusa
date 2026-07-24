import { IRbacModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { invalidateRoleAssignmentCache } from "../utils/invalidate-role-assignment-cache"

/**
 * The filters identifying the role assignments to delete.
 *
 * @ignore
 * @featureFlag rbac
 */
export type DeleteRoleAssignmentsStepInput = {
  reference: string
  reference_id: string[]
  role_id?: string[]
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
  async (data: DeleteRoleAssignmentsStepInput, { container }) => {
    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    if (!data?.reference_id?.length) {
      return new StepResponse([], [])
    }

    const filters: {
      reference: string
      reference_id: string[]
      role_id?: string[]
    } = {
      reference: data.reference,
      reference_id: data.reference_id,
    }

    if (data.role_id?.length) {
      filters.role_id = data.role_id
    }

    const existing = await service.listRbacRoleAssignments(filters)

    if (!existing.length) {
      return new StepResponse([], [])
    }

    await service.deleteRbacRoleAssignments(
      existing.map((assignment) => assignment.id)
    )

    await invalidateRoleAssignmentCache(
      container,
      existing.map(({ reference, reference_id }) => ({
        reference,
        reference_id,
      }))
    )

    return new StepResponse(void 0, existing)
  },
  async (existing, { container }) => {
    if (!existing?.length) {
      return
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    await service.createRbacRoleAssignments(existing)

    await invalidateRoleAssignmentCache(
      container,
      existing.map(({ reference, reference_id }) => ({
        reference,
        reference_id,
      }))
    )
  }
)
