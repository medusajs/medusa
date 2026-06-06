import type { IUserModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The IDs of the invites to delete.
 */
export type DeleteInvitesStepInput = string[]

export const deleteInvitesStepId = "delete-invites-step"
/**
 * This step deletes one or more invites.
 */
export const deleteInvitesStep = createStep(
  deleteInvitesStepId,
  async (input: DeleteInvitesStepInput, { container }) => {
    const service: IUserModuleService = container.resolve(Modules.USER)

    await service.softDeleteInvites(input)

    return new StepResponse(void 0, input)
  },
  async (deletedInviteIds, { container }) => {
    if (!deletedInviteIds?.length) {
      return
    }

    const service: IUserModuleService = container.resolve(Modules.USER)

    await service.restoreInvites(deletedInviteIds)
  }
)
