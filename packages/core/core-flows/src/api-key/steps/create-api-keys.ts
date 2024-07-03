import { CreateApiKeyDTO, IApiKeyModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type CreateApiKeysStepInput = {
  api_keys: CreateApiKeyDTO[]
}

export const createApiKeysStepId = "create-api-keys"
export const createApiKeysStep = createStep(
  createApiKeysStepId,
  async (data: CreateApiKeysStepInput, { container }) => {
    const service = container.resolve<IApiKeyModuleService>(
      ModuleRegistrationName.API_KEY
    )
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

    const service = container.resolve<IApiKeyModuleService>(
      ModuleRegistrationName.API_KEY
    )

    await service.deleteApiKeys(createdIds)
  }
)
