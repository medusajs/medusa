import type { AuthTypes, IAuthModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The ID of the request verification step.
 * 
 * @since 2.15.5
 */
export const requestVerificationStepId = "request-verification"

/**
 * This step requests authentication verification.
 * 
 * @since 2.15.5
 */
export const requestVerificationStep = createStep(
  requestVerificationStepId,
  async (data: AuthTypes.RequestAuthVerificationDTO, { container }) => {
    const service = container.resolve<IAuthModuleService>(Modules.AUTH)

    const result = await service.requestAuthVerification(data)

    return new StepResponse(result)
  }
)
