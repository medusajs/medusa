import { IProductModuleService, ProductTypes } from "@medusajs/types"
import {
  ModuleRegistrationName,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type UpdateCollectionsStepInput = {
  selector: ProductTypes.FilterableProductCollectionProps
  update: ProductTypes.UpdateProductCollectionDTO
}

export const updateCollectionsStepId = "update-collections"
export const updateCollectionsStep = createStep(
  updateCollectionsStepId,
  async (data: UpdateCollectionsStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

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

    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    await service.upsertProductCollections(
      prevData.map((r) => ({
        ...(r as unknown as ProductTypes.UpdateProductCollectionDTO),
      }))
    )
  }
)
