import type { IProductModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * Configurations to retrieve products.
 */
export type GetProductsStepInput = {
  /**
   * The IDs of the products to retrieve.
   */
  ids?: string[]
}

export const getProductsStepId = "get-products"
/**
 * This step retrieves products, with ability to filter by product IDs.
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
      { relations: ["variants"] }
    )
    return new StepResponse(products, products)
  }
)
