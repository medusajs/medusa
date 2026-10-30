import {
  CreateRbacRoleAssignmentDTO,
  IRbacModuleService,
} from "@medusajs/framework/types"
import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * @ignore
 */
export type CreateRoleAssignmentsStepInput = CreateRbacRoleAssignmentDTO[]

/**
 * @ignore
 */
export const createRoleAssignmentsStepId = "create-role-assignments"

/**
 * This step creates one or more RBAC role assignments and invalidates the
 * cached resolved-roles entries of the affected reference entities.
 *
 * @ignore
 */
export const createRoleAssignmentsStep = createStep(
  createRoleAssignmentsStepId,
  async (data: CreateRoleAssignmentsStepInput, { container }) => {
    if (!data?.length || !MedusaModule.isInstalled(Modules.RBAC)) {
      return new StepResponse([], [])
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    const created = await service.createRbacRoleAssignments(data)

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
  }
)
