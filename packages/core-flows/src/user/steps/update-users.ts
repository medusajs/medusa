import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IUserModuleService, UpdateUserDTO } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updateUsersStepId = "update-users-step"
export const updateUsersStep = createStep(
  updateUsersStepId,
  async (input: UpdateUserDTO[], { container }) => {
    const service: IUserModuleService = container.resolve(
      ModuleRegistrationName.USER
    )

    if (!input.length) {
      return new StepResponse([], [])
    }

    const originalUsers = await service.list({
      id: input.map((u) => u.id),
    })

    const users = await service.update(input)
    return new StepResponse(users, originalUsers)
  },
  async (originalUsers, { container }) => {
    if (!originalUsers?.length) {
      return
    }

    const service = container.resolve(ModuleRegistrationName.USER)

    await service.update(
      originalUsers.map((u) => ({
        id: u.id,
        first_name: u.first_name,
        last_name: u.last_name,
        email: u.email,
        avatar_url: u.avatar_url,
        metadata: u.metadata,
      }))
    )
  }
)
