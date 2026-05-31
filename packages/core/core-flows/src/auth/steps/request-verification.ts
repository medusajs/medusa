import type { AuthTypes, IAuthModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export const requestVerificationStepId = "request-verification"

export const requestVerificationStep = createStep(
  requestVerificationStepId,
  async (data: AuthTypes.RequestAuthVerificationDTO, { container }) => {
    const service = container.resolve<IAuthModuleService>(Modules.AUTH)

    const result = await service.requestAuthVerification(data)

    return new StepResponse(result)
  }
)
