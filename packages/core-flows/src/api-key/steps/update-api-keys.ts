import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  FilterableApiKeyProps,
  IApiKeyModuleService,
  UpdateApiKeyDTO,
} from "@medusajs/types"
import { getSelectsAndRelationsFromObjectArray } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type UpdateApiKeysStepInput = {
  selector: FilterableApiKeyProps
  update: Omit<UpdateApiKeyDTO, "id">
}

export const updateApiKeysStepId = "update-api-keys"
export const updateApiKeysStep = createStep(
  updateApiKeysStepId,
  async (data: UpdateApiKeysStepInput, { container }) => {
    const service = container.resolve<IApiKeyModuleService>(
      ModuleRegistrationName.API_KEY
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.list(data.selector, {
      select: selects,
      relations,
    })

    const apiKeys = await service.update(data.selector, data.update)
    return new StepResponse(apiKeys, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IApiKeyModuleService>(
      ModuleRegistrationName.API_KEY
    )

    await service.update(
      prevData.map((r) => ({
        id: r.id,
        title: r.title,
      }))
    )
  }
)
