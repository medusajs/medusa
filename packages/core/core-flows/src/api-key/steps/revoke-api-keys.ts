import {
  FilterableApiKeyProps,
  IApiKeyModuleService,
  RevokeApiKeyDTO,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export type RevokeApiKeysStepInput = {
  selector: FilterableApiKeyProps
  revoke: RevokeApiKeyDTO
}

export const revokeApiKeysStepId = "revoke-api-keys"
/**
 * This step revokes one or more API keys.
 */
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
