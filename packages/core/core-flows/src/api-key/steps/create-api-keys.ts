import {
  CreateApiKeyDTO,
  IApiKeyModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to create API keys.
 */
export type CreateApiKeysStepInput = {
  /**
   * The API keys to create.
   */
  api_keys: CreateApiKeyDTO[]
}

export const createApiKeysStepId = "create-api-keys"
/**
 * This step creates one or more API keys.
 * 
 * @example
 * const data = createApiKeysStep({
 *   api_keys: [
 *     {
 *       type: "publishable",
 *       title: "Storefront",
 *       created_by: "user_123"
 *     }
 *   ]
 * })
 */
export const createApiKeysStep = createStep(
  createApiKeysStepId,
  async (data: CreateApiKeysStepInput, { container }) => {
    const service = container.resolve<IApiKeyModuleService>(Modules.API_KEY)
    const created = await service.createApiKeys(data.api_keys)
    return new StepResponse(
      created,
      created.map((apiKey) => apiKey.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IApiKeyModuleService>(Modules.API_KEY)

    await service.deleteApiKeys(createdIds)
  }
)
