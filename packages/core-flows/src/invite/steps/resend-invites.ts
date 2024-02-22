import { IUserModuleService, InviteDTO } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const resendInvitesStepId = "resend-invites-step"
export const resendInvitesStep = createStep(
  resendInvitesStepId,
  async (input: string[], { container }) => {
    const service: IUserModuleService = container.resolve(
      ModuleRegistrationName.USER
    )

    const resendInvites = await service.resendInvites(input)

    return new StepResponse(resendInvites)
  }
)
