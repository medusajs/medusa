import {
  IAuthModuleService,
  ProviderIdentityDTO,
  ResetPasswordInput,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const resetPasswordStepId = "reset-password-step"
export const resetPasswordStep = createStep(
  resetPasswordStepId,
  async (
    input: {
      provider: string
      resetData: ResetPasswordInput
      providerIdentity: ProviderIdentityDTO
    },
    { container }
  ) => {
    const service: IAuthModuleService = container.resolve(
      ModuleRegistrationName.AUTH
    )

    const oldProviderMetadata = input.providerIdentity.provider_metadata

    const forCompensate = {
      id: input.providerIdentity.id,
      provider_metadata: oldProviderMetadata,
    }

    const result = await service.resetPassword(input.provider, input.resetData)

    return new StepResponse(result, forCompensate)
  },
  async (data, { container }) => {
    if (!data) {
      return
    }

    const service = container.resolve(ModuleRegistrationName.AUTH)

    await service.updateProviderIdentities(data)
  }
)
