import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IProductModuleService } from "@medusajs/types"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

type StepInput = {
  ids?: string[]
}

export const getProductsStepId = "get-products"
export const getProductsStep = createStep(
  getProductsStepId,
  async (data: StepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    if (!data.ids?.length) {
      return new StepResponse([], [])
    }

    const products = await service.listProducts(
      { id: data.ids },
      { relations: ["variants"], take: null }
    )
    return new StepResponse(products, products)
  }
)
