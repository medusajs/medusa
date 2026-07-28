import { IRbacModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { invalidateRoleAssignmentCache } from "../utils/invalidate-role-assignment-cache"
import { MedusaModule } from "@medusajs/framework/modules-sdk"

/**
 * A single role assignment to create.
 *
 * @ignore
 * @featureFlag rbac
 */
export type CreateRoleAssignment = {
  role_id: string
  reference: string
  reference_id: string
  metadata?: Record<string, unknown> | null
}

/**
 * @ignore
 * @featureFlag rbac
 */
export type CreateRoleAssignmentsStepInput = CreateRoleAssignment[]

/**
 * @ignore
 * @featureFlag rbac
 */
export const createRoleAssignmentsStepId = "create-role-assignments"

/**
 * This step creates one or more RBAC role assignments and invalidates the
 * cached resolved-roles entries of the affected reference entities.
 *
 * @ignore
 * @featureFlag rbac
 */
export const createRoleAssignmentsStep = createStep(
  createRoleAssignmentsStepId,
  async (data: CreateRoleAssignmentsStepInput, { container }) => {
    if (!data?.length || !MedusaModule.isInstalled(Modules.RBAC)) {
      return new StepResponse([], [])
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    const created = await service.createRbacRoleAssignments(
      data.map((assignment) => ({
        role_id: assignment.role_id,
        reference: assignment.reference,
        reference_id: assignment.reference_id,
        metadata: assignment.metadata ?? null,
      }))
    )

    await invalidateRoleAssignmentCache(
      container,
      data.map(({ reference, reference_id }) => ({ reference, reference_id }))
    )

    return new StepResponse(
      created,
      created.map((assignment) => ({
        id: assignment.id,
        reference: assignment.reference,
        reference_id: assignment.reference_id,
      }))
    )
  },
  async (createdAssignments, { container }) => {
    if (!createdAssignments?.length) {
      return
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    await service.deleteRbacRoleAssignments(
      createdAssignments.map((assignment) => assignment.id)
    )

    await invalidateRoleAssignmentCache(
      container,
      createdAssignments.map(({ reference, reference_id }) => ({
        reference,
        reference_id,
      }))
    )
  }
)
