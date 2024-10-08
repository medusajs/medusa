import { IUserModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const validateTokenStepId = "validate-invite-token-step"
/**
 * This step validates a specified token and returns its associated invite.
 */
export const validateTokenStep = createStep(
  validateTokenStepId,
  async (input: string, { container }) => {
    const userModuleService: IUserModuleService = container.resolve(
      Modules.USER
    )

    const invite = await userModuleService.validateInviteToken(input)

    return new StepResponse(invite)
  }
)
