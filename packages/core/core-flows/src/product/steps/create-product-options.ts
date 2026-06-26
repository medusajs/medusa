import type {
  IProductModuleService,
  ProductTypes,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The data to create one or more product options.
 */
export type CreateProductOptionsStepInput = ProductTypes.CreateProductOptionDTO[]

export const createProductOptionsStepId = "create-product-options"
/**
 * This step creates one or more product options.
 *
 * @example
 * const data = createProductOptionsStep([{
 *   title: "Size",
 *   values: ["S", "M", "L"],
 *   ranks: {
 *     "S": 2,
 *     "M": 1,
 *     "L": 3
 *   }
 * }])
 */
export const createProductOptionsStep = createStep(
  createProductOptionsStepId,
  async (data: CreateProductOptionsStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    const created = await service.createProductOptions(data)
    return new StepResponse(
      created,
      created.map((productOption) => productOption.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.deleteProductOptions(createdIds)
  }
)
