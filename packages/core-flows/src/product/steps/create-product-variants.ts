import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IProductModuleService, ProductTypes } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createProductVariantsStepId = "create-product-variants"
export const createProductVariantsStep = createStep(
  createProductVariantsStepId,
  async (data: ProductTypes.CreateProductVariantDTO[], { container }) => {
    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )
    const created = await service.createVariants(data)
    return new StepResponse(
      created,
      created.map((productVariant) => productVariant.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    await service.deleteVariants(createdIds)
  }
)
