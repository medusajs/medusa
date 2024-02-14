import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  IUserModuleService,
  UpdateInviteDTO,
  UpdateUserDTO,
} from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updateInvitesStepId = "update-invites-step"
export const updateInvitesStep = createStep(
  updateInvitesStepId,
  async (input: UpdateInviteDTO[], { container }) => {
    const service: IUserModuleService = container.resolve(
      ModuleRegistrationName.USER
    )

    if (!input.length) {
      return new StepResponse([], [])
    }

    const originalInvites = await service.listInvites({
      id: input.map((u) => u.id),
    })

    if (!originalInvites?.length) {
      return new StepResponse([], [])
    }

    const invites = await service.updateInvites(input)
    return new StepResponse(invites, originalInvites)
  },
  async (originalInvites, { container }) => {
    if (!originalInvites?.length) {
      return
    }

    const service = container.resolve(ModuleRegistrationName.USER)

    await service.updateInvites(
      originalInvites.map((invite) => ({
        id: invite.id,
        email: invite.email,
        accepted: invite.accepted,
        token: invite.token,
        expires_at: invite.expires_at,
        metadata: invite.metadata,
      }))
    )
  }
)
