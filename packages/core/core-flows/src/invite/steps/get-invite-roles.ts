import { IRbacModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * @ignore
 * @featureFlag rbac
 */
export interface GetInviteRolesStepInput {
  invite_id: string
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const getInviteRolesStepId = "get-invite-roles-step"
/**
 * This step retrieves the roles associated with an invite.
 *
 * @example
 * const data = getInviteRolesStep({
 *   invite_id: "invite_123"
 * })
 * @ignore
 * @featureFlag rbac
 */
export const getInviteRolesStep = createStep(
  getInviteRolesStepId,
  async (input: GetInviteRolesStepInput, { container }) => {
    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    const assignments = await service.listRbacRoleAssignments({
      reference: "invite",
      reference_id: input.invite_id,
    })

    const roleIds = assignments.map((assignment) => assignment.role_id)

    return new StepResponse(roleIds)
  }
)
