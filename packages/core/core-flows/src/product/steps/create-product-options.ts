import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IProductModuleService, ProductTypes } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createProductOptionsStepId = "create-product-options"
export const createProductOptionsStep = createStep(
  createProductOptionsStepId,
  async (data: ProductTypes.CreateProductOptionDTO[], { container }) => {
    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    const created = await service.createOptions(data)
    return new StepResponse(
      created,
      created.map((productOption) => productOption.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    await service.deleteOptions(createdIds)
  }
)
