import { CreateUserDTO, IUserModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const createUsersStepId = "create-users-step"
/**
 * This step creates one or more users.
 */
export const createUsersStep = createStep(
  createUsersStepId,
  async (input: CreateUserDTO[], { container }) => {
    const service: IUserModuleService = container.resolve(Modules.USER)
    const users = await service.createUsers(input)
    return new StepResponse(users)
  },
  async (createdUsers, { container }) => {
    if (!createdUsers?.length) {
      return
    }
    const service = container.resolve(Modules.USER)
    await service.deleteUsers(createdUsers.map((user) => user.id))
  }
)
