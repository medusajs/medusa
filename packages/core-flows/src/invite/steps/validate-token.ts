import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { InviteDTO } from "@medusajs/types"
import { IUserModuleService } from "@medusajs/types"
import { StepResponse } from "@medusajs/workflows-sdk"
import { createStep } from "@medusajs/workflows-sdk"

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
