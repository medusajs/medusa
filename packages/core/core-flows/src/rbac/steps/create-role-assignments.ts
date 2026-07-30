import {
  CreateRbacRoleAssignmentDTO,
  IRbacModuleService,
} from "@medusajs/framework/types"
import { FeatureFlag, Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { invalidateRoleAssignmentCache } from "../utils/invalidate-role-assignment-cache"

/**
 * @ignore
 * @featureFlag rbac
 */
export type CreateRoleAssignmentsStepInput = CreateRbacRoleAssignmentDTO[]

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
    if (!data?.length || !FeatureFlag.isFeatureEnabled("rbac")) {
      return new StepResponse([], [])
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    const created = await service.createRbacRoleAssignments(data)

    // TODO: [rbac] revisit this when we implement role resolution
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

    // TODO: [rbac] revisit this when we reimplement role resolution
    await invalidateRoleAssignmentCache(
      container,
      createdAssignments.map(({ reference, reference_id }) => ({
        reference,
        reference_id,
      }))
    )
  }
)
