import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IProductModuleService, ProductTypes } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createCollectionsStepId = "create-collections"
export const createCollectionsStep = createStep(
  createCollectionsStepId,
  async (data: ProductTypes.CreateProductCollectionDTO[], { container }) => {
    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    const created = await service.createCollections(data)
    return new StepResponse(
      created,
      created.map((collection) => collection.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    await service.deleteCollections(createdIds)
  }
)
