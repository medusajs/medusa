import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CreateUserDTO, IUserModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createUsersStepId = "create-users-step"
export const createUsersStep = createStep(
  createUsersStepId,
  async (input: CreateUserDTO[], { container }) => {
    const service: IUserModuleService = container.resolve(
      ModuleRegistrationName.USER
    )
    const users = await service.create(input)
    return new StepResponse(users)
  },
  async (createdUsers, { container }) => {
    if (!createdUsers?.length) {
      return
    }
    const service = container.resolve(ModuleRegistrationName.USER)
    await service.delete(createdUsers)
  }
)
