import {
  FilterableStoreProps,
  IStoreModuleService,
  UpdateStoreDTO,
} from "@zjedene-medusa/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to update in a store.
 */
export type UpdateStoresStepInput = {
  /**
   * The filters to select the stores to update.
   */
  selector: FilterableStoreProps
  /**
   * The data to update in the stores.
   */
  update: UpdateStoreDTO
}

export const updateStoresStepId = "update-stores"
/**
 * This step updates stores matching the specified filters.
 * 
 * @example
 * const data = updateStoresStep({
 *   selector: {
 *     id: "store_123"
 *   },
 *   update: {
 *     name: "Acme"
 *   }
 * })
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
