import { IProductModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export type GetProductsStepInput = {
  ids?: string[]
}

export const getProductsStepId = "get-products"
/**
 * This step retrieves products.
 */
export const getProductsStep = createStep(
  getProductsStepId,
  async (data: GetProductsStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

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
