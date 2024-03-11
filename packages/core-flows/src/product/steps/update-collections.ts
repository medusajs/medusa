import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IProductModuleService, ProductTypes } from "@medusajs/types"
import { getSelectsAndRelationsFromObjectArray } from "@medusajs/utils"
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

    const prevData = await service.listCollections(data.selector, {
      select: selects,
      relations,
    })

    const collections = await service.updateCollections(
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

    await service.upsertCollections(
      prevData.map((r) => ({
        ...(r as unknown as ProductTypes.UpdateProductCollectionDTO),
      }))
    )
  }
)
