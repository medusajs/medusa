import {
  IProductModuleService,
  LinkWorkflowInput,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

export const batchLinkProductsToCollectionStepId =
  "batch-link-products-to-collection"
/**
 * This step manages the links between a collection and products.
 * 
 * @example
 * const data = batchLinkProductsToCollectionStep({
 *   id: "collection_123",
 *   add: ["product_123"],
 *   remove: ["product_321"]
 * })
 */
export const batchLinkProductsToCollectionStep = createStep(
  batchLinkProductsToCollectionStepId,
  async (data: LinkWorkflowInput, { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    if (!data.add?.length && !data.remove?.length) {
      return new StepResponse(void 0, null)
    }

    const dbCollection = await service.retrieveProductCollection(data.id, {
      select: ["id", "products.id"],
      relations: ["products"],
    })
    const existingProductIds = dbCollection.products?.map((p) => p.id) ?? []
    const toRemoveMap = new Map(data.remove?.map((id) => [id, true]) ?? [])

    const newProductIds = [
      ...existingProductIds.filter((id) => !toRemoveMap.has(id)),
      ...(data.add ?? []),
    ]

    await service.updateProductCollections(data.id, {
      product_ids: newProductIds,
    })

    return new StepResponse(void 0, {
      id: data.id,
      productIds: existingProductIds,
    })
  },
  async (prevData, { container }) => {
    if (!prevData) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.updateProductCollections(prevData.id, {
      product_ids: prevData.productIds,
    })
  }
)
