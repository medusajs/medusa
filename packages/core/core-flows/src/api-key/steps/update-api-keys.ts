import {
  FilterableApiKeyProps,
  IApiKeyModuleService,
  UpdateApiKeyDTO,
} from "@zjedene-medusa/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to update API keys.
 */
export type UpdateApiKeysStepInput = {
  /**
   * The filters to select the API keys to update.
   */
  selector: FilterableApiKeyProps
  /**
   * The data to update the API keys.
   */
  update: UpdateApiKeyDTO
}

export const updateApiKeysStepId = "update-api-keys"
/**
 * This step updates one or more API keys.
 * 
 * @example
 * const data = updateApiKeysStep({
 *   selector: {
 *     id: "apk_123"
 *   },
 *   update: {
 *     title: "Storefront"
 *   }
 * })
 */
export const updateApiKeysStep = createStep(
  updateApiKeysStepId,
  async (data: UpdateApiKeysStepInput, { container }) => {
    const service = container.resolve<IApiKeyModuleService>(Modules.API_KEY)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.listApiKeys(data.selector, {
      select: selects,
      relations,
    })

    const apiKeys = await service.updateApiKeys(data.selector, data.update)
    return new StepResponse(apiKeys, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IApiKeyModuleService>(Modules.API_KEY)

    await service.upsertApiKeys(
      prevData.map((r) => ({
        id: r.id,
        title: r.title,
      }))
    )
  }
)
