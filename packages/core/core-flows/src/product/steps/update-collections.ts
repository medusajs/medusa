import type {
  IProductModuleService,
  ProductTypes,
} from "@zjedene-medusa/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to identify and update the product collections.
 */
export type UpdateCollectionsStepInput = {
  /**
   * The filters to select the collections to update.
   */
  selector: ProductTypes.FilterableProductCollectionProps
  /**
   * The data to update the collections with.
   */
  update: ProductTypes.UpdateProductCollectionDTO
}

export const updateCollectionsStepId = "update-collections"
/**
 * This step updates collections matching the specified filters.
 *
 * @example
 * const data = updateCollectionsStep({
 *   selector: {
 *     id: "collection_123"
 *   },
 *   update: {
 *     title: "Summer Collection"
 *   }
 * })
 */
export const updateCollectionsStep = createStep(
  updateCollectionsStepId,
  async (data: UpdateCollectionsStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.listProductCollections(data.selector, {
      select: selects,
      relations,
    })

    const collections = await service.updateProductCollections(
      data.selector,
      data.update
    )
    return new StepResponse(collections, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.upsertProductCollections(
      prevData.map((r) => ({
        ...(r as unknown as ProductTypes.UpdateProductCollectionDTO),
      }))
    )
  }
)
