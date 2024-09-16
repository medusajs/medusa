import { IApiKeyModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteApiKeysStepId = "delete-api-keys"
/**
 * This step deletes one or more API keys.
 */
export const deleteApiKeysStep = createStep(
  { name: deleteApiKeysStepId, noCompensation: true },
  async (ids: string[], { container }) => {
    const service = container.resolve<IApiKeyModuleService>(Modules.API_KEY)

    await service.deleteApiKeys(ids)
    return new StepResponse(void 0)
  },
  async () => {}
)
