import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IProductModuleService } from "@medusajs/types"
import { LinkWorkflowInput } from "@medusajs/types/src"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const batchLinkProductsToCollectionStepId =
  "batch-link-products-to-collection"
export const batchLinkProductsToCollectionStep = createStep(
  batchLinkProductsToCollectionStepId,
  async (data: LinkWorkflowInput, { container }) => {
    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    if (!data.add?.length && !data.remove?.length) {
      return new StepResponse(void 0, null)
    }

    const dbCollection = await service.retrieveCollection(data.id, {
      take: null,
      select: ["id", "products.id"],
      relations: ["products"],
    })
    const existingProductIds = dbCollection.products?.map((p) => p.id) ?? []
    const toRemoveMap = new Map(data.remove?.map((id) => [id, true]) ?? [])

    const newProductIds = [
      ...existingProductIds.filter((id) => !toRemoveMap.has(id)),
      ...(data.add ?? []),
    ]

    await service.updateCollections(data.id, {
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

    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    await service.updateCollections(prevData.id, {
      product_ids: prevData.productIds,
    })
  }
)
