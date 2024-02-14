import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CreateInviteDTO, IUserModuleService, InviteDTO } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createInviteStepId = "create-invite-step"
export const createInviteStep = createStep(
  createInviteStepId,
  async (input: CreateInviteDTO[], { container }) => {
    const service: IUserModuleService = container.resolve(
      ModuleRegistrationName.USER
    )

    const createdInvites = await service.createInvites(input)

    return new StepResponse(createdInvites)
  },
  async (createdInvites, { container }) => {
    if (!createdInvites?.length) {
      return
    }

    const service: IUserModuleService = container.resolve(
      ModuleRegistrationName.USER
    )

    await service.deleteInvites(
      createdInvites.map((invite: InviteDTO) => invite.id)
    )
  }
)
