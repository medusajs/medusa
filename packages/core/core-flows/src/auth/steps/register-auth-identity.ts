import type { AuthTypes, IAuthModuleService } from "@medusajs/framework/types"
import { Modules, MedusaError } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const registerAuthIdentityStepId = "register-auth-identity"

/**
 * This step registers a new auth identity using a specified provider.
 * It uses the `register` method of the underlying provider, passing it the `providerData`.
 */
export const registerAuthIdentityStep = createStep(
  registerAuthIdentityStepId,
  async (
    data: { provider: string; providerData: AuthTypes.AuthenticationInput },
    { container }
  ) => {
    const service = container.resolve<IAuthModuleService>(Modules.AUTH)

    const response = await service.register(data.provider, data.providerData)

    if (!response.success) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        response.error || "Failed to register auth identity"
      )
    }

    if (!response.authIdentity) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Provider returned success but no auth identity was created"
      )
    }

    return new StepResponse(response.authIdentity, response.authIdentity.id)
  },
  async (id, { container }) => {
    if (!id) {
      return
    }

    const service = container.resolve<IAuthModuleService>(Modules.AUTH)
    await service.deleteAuthIdentities([id])
  }
)
