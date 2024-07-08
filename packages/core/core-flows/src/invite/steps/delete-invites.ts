import { IUserModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteInvitesStepId = "delete-invites-step"
export const deleteInvitesStep = createStep(
  deleteInvitesStepId,
  async (input: string[], { container }) => {
    const service: IUserModuleService = container.resolve(
      ModuleRegistrationName.USER
    )

    await service.softDeleteInvites(input)

    return new StepResponse(void 0, input)
  },
  async (deletedInviteIds, { container }) => {
    if (!deletedInviteIds?.length) {
      return
    }

    const service: IUserModuleService = container.resolve(
      ModuleRegistrationName.USER
    )

    await service.restoreInvites(deletedInviteIds)
  }
)
