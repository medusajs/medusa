import type { IUserModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The IDs of the users to delete.
 */
export type DeleteUsersStepInput = string[]

export const deleteUsersStepId = "delete-users-step"
/**
 * This step deletes one or more users.
 */
export const deleteUsersStep = createStep(
  deleteUsersStepId,
  async (input: DeleteUsersStepInput, { container }) => {
    const service: IUserModuleService = container.resolve(Modules.USER)

    await service.softDeleteUsers(input)

    return new StepResponse(void 0, input)
  },
  async (prevUserIds, { container }) => {
    if (!prevUserIds?.length) {
      return
    }

    const service: IUserModuleService = container.resolve(Modules.USER)

    await service.restoreUsers(prevUserIds)
  }
)
