import { IUserModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

import { Modules } from "@medusajs/framework/utils"

export const refreshInviteTokensStepId = "refresh-invite-tokens-step"
/**
 * This step refreshes the tokens of one or more invites.
 */
export const refreshInviteTokensStep = createStep(
  refreshInviteTokensStepId,
  async (input: string[], { container }) => {
    const service: IUserModuleService = container.resolve(Modules.USER)

    const invites = await service.refreshInviteTokens(input)

    return new StepResponse(invites)
  }
)
