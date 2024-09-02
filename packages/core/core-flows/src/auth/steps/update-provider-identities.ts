import { IAuthModuleService, ProviderIdentityDTO } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updateProviderIdentitiesStepId = "update-provider-identities-step"
/**
 * This step updates one or more provider identities.
 */
export const updateProviderIdentitiesStep = createStep(
  updateProviderIdentitiesStepId,
  async (input: ProviderIdentityDTO[], { container }) => {
    const service: IAuthModuleService = container.resolve(
      ModuleRegistrationName.AUTH
    )

    if (!input.length) {
      return new StepResponse([], [])
    }

    const originalIdentities = await service.listProviderIdentities({
      id: input.map((u) => u.id),
    })

    const identities = await service.updateProviderIdentities(input)
    return new StepResponse(identities, originalIdentities)
  },
  async (originalIdentities, { container }) => {
    if (!originalIdentities?.length) {
      return
    }

    const service = container.resolve(ModuleRegistrationName.AUTH)

    await service.updateProviderIdentities(
      originalIdentities.map((u) => ({
        id: u.id,
        user_metadata: u.user_metadata,
        provider_metadata: u.provider_metadata,
      }))
    )
  }
)
