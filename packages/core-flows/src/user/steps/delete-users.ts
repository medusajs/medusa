import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IUserModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type DeleteUsersStepInput = string[]

export const deleteUsersStepId = "delete-users-step"
export const deleteUsersStep = createStep(
  deleteUsersStepId,
  async (input: DeleteUsersStepInput, { container }) => {
    const service: IUserModuleService = container.resolve(
      ModuleRegistrationName.USER
    )

    await service.softDelete(input)

    return new StepResponse(void 0, input)
  },
  async (prevUserIds, { container }) => {
    if (!prevUserIds?.length) {
      return
    }

    const service: IUserModuleService = container.resolve(
      ModuleRegistrationName.USER
    )

    await service.restore(prevUserIds)
  }
)
