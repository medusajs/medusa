import type {
  IProductModuleService,
  ProductTypes,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

export const createProductsStepId = "create-products"
/**
 * This step creates one or more products.
 *
 * @example
 * const data = createProductsStep([{
 *   title: "Shirt",
 *   options: [
 *     {
 *       title: "Size",
 *       values: ["S", "M", "L"]
 *     }
 *   ],
 *   variants: [
 *     {
 *       title: "Small Shirt",
 *       options: {
 *         Size: "S"
 *       }
 *     }
 *   ]
 * }])
 */
export const createProductsStep = createStep(
  createProductsStepId,
  async (data: ProductTypes.CreateProductDTO[], { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    const created = await service.createProducts(data)
    return new StepResponse(
      created,
      created.map((product) => product.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.deleteProducts(createdIds)
  }
)
