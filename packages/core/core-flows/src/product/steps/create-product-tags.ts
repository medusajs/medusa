import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IProductModuleService, ProductTypes } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createProductTagsStepId = "create-product-tags"
export const createProductTagsStep = createStep(
  createProductTagsStepId,
  async (data: ProductTypes.CreateProductTagDTO[], { container }) => {
    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    const created = await service.createTags(data)
    return new StepResponse(
      created,
      created.map((productTag) => productTag.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    await service.deleteTags(createdIds)
  }
)
