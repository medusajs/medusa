import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IAuthModuleService, UpdateAuthUserDTO } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updateAuthUserStepId = "update-auth-user"
export const updateAuthUserStep = createStep(
  updateAuthUserStepId,
  async (data: UpdateAuthUserDTO[], { container }) => {
    const authModule: IAuthModuleService = container.resolve(
      ModuleRegistrationName.AUTH
    )

    const updatedUser = await authModule.updateAuthUser(data)

    return new StepResponse(updatedUser)
  }
)
