import {
  FilterableStoreProps,
  IStoreModuleService,
  UpdateStoreDTO,
} from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export type UpdateStoresStepInput = {
  selector: FilterableStoreProps
  update: UpdateStoreDTO
}

export const updateStoresStepId = "update-stores"
/**
 * This step updates stores matching the specified filters.
 */
export const updateStoresStep = createStep(
  updateStoresStepId,
  async (data: UpdateStoresStepInput, { container }) => {
    const service = container.resolve<IStoreModuleService>(Modules.STORE)

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

    const service = container.resolve<IStoreModuleService>(Modules.STORE)

    await service.upsertStores(
      prevData.map((r) => ({
        ...r,
        metadata: r.metadata || undefined,
      }))
    )
  }
)
