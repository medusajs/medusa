import type {
  CreateUserDTO,
  IUserModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

export const createUsersStepId = "create-users-step"
/**
 * This step creates one or more users. To allow these users to log in,
 * you must attach an auth identity to each user using the {@link setAuthAppMetadataStep}.
 *
 * @example
 * const data = createUsersStep([
 *   {
 *     email: "example@gmail.com",
 *     first_name: "John",
 *     last_name: "Doe",
 *   }
 * ])
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
