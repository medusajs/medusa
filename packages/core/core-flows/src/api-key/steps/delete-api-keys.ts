import { IApiKeyModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteApiKeysStepId = "delete-api-keys"
export const deleteApiKeysStep = createStep(
  { name: deleteApiKeysStepId, noCompensation: true },
  async (ids: string[], { container }) => {
    const service = container.resolve<IApiKeyModuleService>(
      ModuleRegistrationName.API_KEY
    )

    await service.deleteApiKeys(ids)
    return new StepResponse(void 0)
  },
  async () => {}
)
