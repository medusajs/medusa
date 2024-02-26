import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IApiKeyModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteApiKeysStepId = "delete-api-keys"
export const deleteApiKeysStep = createStep(
  { name: deleteApiKeysStepId, noCompensation: true },
  async (ids: string[], { container }) => {
    const service = container.resolve<IApiKeyModuleService>(
      ModuleRegistrationName.API_KEY
    )

    await service.delete(ids)
    return new StepResponse(void 0)
  },
  async () => {}
)
