import { IUserModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const deleteUsersStepId = "delete-users-step"
/**
 * This step deletes one or more stores.
 */
export const deleteUsersStep = createStep(
  deleteUsersStepId,
  async (input: string[], { container }) => {
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
