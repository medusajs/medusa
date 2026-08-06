import { MedusaModule } from "@medusajs/framework/modules-sdk"
import {
  CreateActorRoleDTO,
  IRbacModuleService,
} from "@medusajs/framework/types"
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
 * This step retrieves the roles associated with an invite, each carrying the
 * scope of its assignment, so the roles can be re-assigned as-is to the user
 * created when the invite is accepted.
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
    if (!MedusaModule.isInstalled(Modules.RBAC)) {
      return new StepResponse([])
    }

    const service = container.resolve<IRbacModuleService>(Modules.RBAC)

    const assignments = await service.listRbacRoleAssignments({
      reference: "invite",
      reference_id: input.invite_id,
    })

    const roles = assignments.map((assignment): CreateActorRoleDTO => {
      return assignment.scope && assignment.scope_id
        ? {
            role_id: assignment.role_id,
            scopes: [{ type: assignment.scope, id: assignment.scope_id }],
          }
        : { role_id: assignment.role_id }
    })

    return new StepResponse(roles)
  }
)
