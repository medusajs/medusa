import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  FilterableStoreProps,
  IStoreModuleService,
  UpdateStoreDTO,
} from "@medusajs/types"
import { getSelectsAndRelationsFromObjectArray } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type UpdateStoresStepInput = {
  selector: FilterableStoreProps
  update: UpdateStoreDTO
}

export const updateStoresStepId = "update-stores"
export const updateStoresStep = createStep(
  updateStoresStepId,
  async (data: UpdateStoresStepInput, { container }) => {
    const service = container.resolve<IStoreModuleService>(
      ModuleRegistrationName.STORE
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.listStores(data.selector, {
      select: selects,
      relations,
    })

    const stores = await service.updateStores(data.selector, data.update)
    return new StepResponse(stores, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IStoreModuleService>(
      ModuleRegistrationName.STORE
    )

    await service.upsertStores(
      prevData.map((r) => ({
        ...r,
        metadata: r.metadata || undefined,
      }))
    )
  }
)
