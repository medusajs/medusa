import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createUsersStepId = "create-users-step"
export const createUsersStep = createStep(
  createUsersStepId,
  async (input, { container }) => {
    const service = container.resolve(ModuleRegistrationName.USER)
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
