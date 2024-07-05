import { IUserModuleService, InviteDTO } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const refreshInviteTokensStepId = "refresh-invite-tokens-step"
export const refreshInviteTokensStep = createStep(
  refreshInviteTokensStepId,
  async (input: string[], { container }) => {
    const service: IUserModuleService = container.resolve(
      ModuleRegistrationName.USER
    )

    const invites = await service.refreshInviteTokens(input)

    return new StepResponse(invites)
  }
)
