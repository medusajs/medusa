import { MedusaModule } from "@medusajs/framework/modules-sdk"
import {
  IRbacModuleService,
  RbacRoleAssignmentDTO,
  RbacScope,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export type GetRoleAssignmentsStepInput = {
  /**
   * The type of the entity the assignments reference, such as `user` or `invite`.
   */
  reference: string
  /**
   * The IDs of the referenced entities.
   */
  reference_id: string[]
  /**
   * When provided, only the assignments scoped to it are returned. Omit it to
   * return the assignments regardless of their scope.
   */
  scope?: RbacScope
}

export const getRoleAssignmentsStepId = "get-role-assignments"

/**
 * This step retrieves the RBAC role assignments referencing the given
 * entities, so they can be cleaned up when those entities are deleted.
 */
export const getRoleAssignmentsStep = createStep(
  getRoleAssignmentsStepId,
  async (input: GetRoleAssignmentsStepInput, { container }) => {
    if (
      !input.reference_id?.length ||
      !MedusaModule.isInstalled(Modules.RBAC)
    ) {
      return new StepResponse([] as RbacRoleAssignmentDTO[])
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    const assignments = await service.listRbacRoleAssignments(
      {
        reference: input.reference,
        reference_id: input.reference_id,
        ...(input.scope
          ? { scope: input.scope.typ˝e, scope_id: input.scope.id }
          : {}),
      },
      {
        select: [
          "id",
          "role_id",
          "reference",
          "reference_id",
          "scope",
          "scope_id",
        ],
      }
    )

    return new StepResponse(assignments)
  }
)
