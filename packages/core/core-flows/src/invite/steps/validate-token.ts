import { IUserModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const validateTokenStepId = "validate-invite-token-step"
export const validateTokenStep = createStep(
  validateTokenStepId,
  async (input: string, { container }) => {
    const userModuleService: IUserModuleService = container.resolve(
      ModuleRegistrationName.USER
    )

    const invite = await userModuleService.validateInviteToken(input)

    return new StepResponse(invite)
  }
)
