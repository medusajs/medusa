import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { IRbacModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * @ignore
 * @featureFlag rbac
 */
export type GetRoleAssignmentIdsStepInput = {
  /**
   * The type of the entity the assignments reference, such as `user` or `invite`.
   */
  reference: string
  /**
   * The IDs of the referenced entities.
   */
  reference_id: string[]
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const getRoleAssignmentIdsStepId = "get-role-assignment-ids"

/**
 * This step retrieves the IDs of the RBAC role assignments referencing the
 * given entities, so they can be cleaned up when those entities are deleted.
 *
 * It resolves to an empty list when RBAC is not installed, which lets the
 * workflows that clean up after users and invites run unchanged whether or not
 * RBAC is enabled.
 *
 * @ignore
 * @featureFlag rbac
 */
export const getRoleAssignmentIdsStep = createStep(
  getRoleAssignmentIdsStepId,
  async (input: GetRoleAssignmentIdsStepInput, { container }) => {
    if (
      !input.reference_id?.length ||
      !MedusaModule.isInstalled(Modules.RBAC)
    ) {
      return new StepResponse([])
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    const assignments = await service.listRbacRoleAssignments({
      reference: input.reference,
      reference_id: input.reference_id,
    })

    return new StepResponse(assignments.map((assignment) => assignment.id))
  }
)
