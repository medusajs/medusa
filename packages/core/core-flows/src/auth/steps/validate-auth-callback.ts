import type {
  AuthenticationInput,
  AuthenticationResponse,
  IAuthModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The data to validate a third-party provider's authentication callback.
 */
export type ValidateAuthCallbackStepInput = {
  /**
   * The ID of the auth provider, such as `github`.
   */
  auth_provider: string
  /**
   * The request's data, such as its query and body.
   */
  auth_data: AuthenticationInput
}

/**
 * The ID of the validate auth callback step.
 *
 * @since 2.23.1
 */
export const validateAuthCallbackStepId = "validate-auth-callback"

/**
 * This step validates a third-party provider's authentication callback.
 *
 * @since 2.23.1
 */
export const validateAuthCallbackStep = createStep(
  validateAuthCallbackStepId,
  async (input: ValidateAuthCallbackStepInput, { container }) => {
    const service = container.resolve<IAuthModuleService>(Modules.AUTH)

    const result: AuthenticationResponse = await service.validateCallback(
      input.auth_provider,
      input.auth_data
    )

    return new StepResponse(result)
  }
)
