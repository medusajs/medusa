import { IUserModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteUsersStepId = "delete-users-step"
export const deleteUsersStep = createStep(
  deleteUsersStepId,
  async (input: string[], { container }) => {
    const service: IUserModuleService = container.resolve(
      ModuleRegistrationName.USER
    )

    await service.softDeleteUsers(input)

    return new StepResponse(void 0, input)
  },
  async (prevUserIds, { container }) => {
    if (!prevUserIds?.length) {
      return
    }

    const service: IUserModuleService = container.resolve(
      ModuleRegistrationName.USER
    )

    await service.restoreUsers(prevUserIds)
  }
)
