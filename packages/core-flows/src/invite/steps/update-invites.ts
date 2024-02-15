import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  IUserModuleService,
  UpdateInviteDTO,
  UpdateUserDTO,
} from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updateUsersStepId = "update-users-step"
export const updateUsersStep = createStep(
  updateUsersStepId,
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

    const invites = await service.updateInvites(input)
    return new StepResponse(invites, originalInvites)
  },
  async (originalInvites, { container }) => {
    if (!originalInvites?.length) {
      return
    }

    const service: IUserModuleService = container.resolve(
      ModuleRegistrationName.USER
    )

    await service.updateInvites(
      originalInvites.map((u) => ({
        id: u.id,
        accepted: u.accepted,
        token: u.token,
        metadata: u.metadata,
      }))
    )
  }
)
