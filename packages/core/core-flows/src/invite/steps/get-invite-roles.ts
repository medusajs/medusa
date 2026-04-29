import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
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
    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

    const linkService = remoteLink.getLinkModule(
      Modules.USER,
      "invite_id",
      Modules.RBAC,
      "rbac_role_id"
    )

    if (!linkService) {
      return new StepResponse([])
    }

    const inviteRoles = await linkService.list({
      invite_id: input.invite_id,
    })

    const roleIds = inviteRoles.map((link: any) => link.rbac_role_id)

    return new StepResponse(roleIds)
  }
)
