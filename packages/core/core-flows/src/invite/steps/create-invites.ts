import { CreateInviteDTO, IUserModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createInviteStepId = "create-invite-step"
export const createInviteStep = createStep(
  createInviteStepId,
  async (input: CreateInviteDTO[], { container }) => {
    const service: IUserModuleService = container.resolve(
      ModuleRegistrationName.USER
    )

    const createdInvites = await service.createInvites(input)

    return new StepResponse(
      createdInvites,
      createdInvites.map((inv) => inv.id)
    )
  },
  async (createdInvitesIds, { container }) => {
    if (!createdInvitesIds?.length) {
      return
    }

    const service: IUserModuleService = container.resolve(
      ModuleRegistrationName.USER
    )

    await service.deleteInvites(createdInvitesIds)
  }
)
