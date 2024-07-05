import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  FilterableApiKeyProps,
  IApiKeyModuleService,
  RevokeApiKeyDTO,
} from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type RevokeApiKeysStepInput = {
  selector: FilterableApiKeyProps
  revoke: RevokeApiKeyDTO
}

export const revokeApiKeysStepId = "revoke-api-keys"
export const revokeApiKeysStep = createStep(
  { name: revokeApiKeysStepId, noCompensation: true },
  async (data: RevokeApiKeysStepInput, { container }) => {
    const service = container.resolve<IApiKeyModuleService>(
      ModuleRegistrationName.API_KEY
    )

    const apiKeys = await service.revoke(data.selector, data.revoke)
    return new StepResponse(apiKeys)
  },
  async () => {}
)
