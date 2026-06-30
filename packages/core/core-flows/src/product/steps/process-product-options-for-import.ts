import type {
  IProductModuleService,
  ProductTypes,
  UpdateProductWorkflowInputDTO,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { deepCopy } from "@medusajs/utils"

export const processProductOptionsForImportStepId =
  "process-product-options-for-import"

/**
 * The data to process products with options during import.
 */
export type ProcessProductOptionsForImportInput = {
  /**
   * The products to process. Each product can optionally have an `options` field
   * containing the product options to create.
   */
  products: (Omit<UpdateProductWorkflowInputDTO, "option_ids"> & {
    /**
     * The product options to create for the product.
     */
    options?: ProductTypes.CreateProductOptionDTO[]
  })[]
}

/**
 * This step processes products with options during import. It performs the following actions:
 * 
 * 1. Creates product options.
 * 2. Transforms `product.options` in the input to `product.option_ids`.
 * 3. Transforms variant options from `{title: value}` to `{optionId: value}`.
 * 
 * @since 2.16.0
 * 
 * @example
 * const data = processProductOptionsForImportStep({
 *   products: [
 *     {
 *       title: "T-Shirt",
 *       options: [
 *         {
 *           title: "Size",
 *           values: ["S", "M", "L"]
 *         }
 *       ],
 *       variants: [
 *         {
 *           title: "T-Shirt - Small",
 *           options: {
 *             Size: "S"
 *           }
 *         }
 *       ]
 *     }
 *   ]
 * })
 */
export const processProductOptionsForImportStep = createStep(
  processProductOptionsForImportStepId,
  async (
    data: ProcessProductOptionsForImportInput,
    { container }
  ): Promise<StepResponse<UpdateProductWorkflowInputDTO[], string[]>> => {
    const productService = container.resolve<IProductModuleService>(
      Modules.PRODUCT
    )

    const processedProducts: UpdateProductWorkflowInputDTO[] = []

    const allOptions: ProductTypes.CreateProductOptionDTO[] = []
    const productIndices: number[] = [] // Maps option index to product index

    data.products.forEach((product, index) => {
      (product.options ?? []).forEach((option) => {
        allOptions.push(option)
        productIndices.push(index)
      })
    })

    const createdOptions =
      allOptions.length > 0
        ? await productService.createProductOptions(allOptions.map(option => ({
          ...option,
          is_exclusive: true // Until we change the CSV logic to pass option id in there, we have to default to exclusive
        })))
        : []
    const createdOptionIds = createdOptions.map((opt) => opt.id)

    const productOptionsMap = new Map<
      number,
      ProductTypes.ProductOptionDTO[]
    >()
    createdOptions.forEach((option, index) => {
      const productIndex = productIndices[index]
      if (!productOptionsMap.has(productIndex)) {
        productOptionsMap.set(productIndex, [])
      }
      productOptionsMap.get(productIndex)!.push(option)
    })

    data.products.forEach((product, index) => {
      const createdOptionsForProduct = productOptionsMap.get(index)

      if (createdOptionsForProduct && createdOptionsForProduct.length) {
        // Transform product to use option_ids instead of options
        const transformedProduct: any = deepCopy(product)
        delete transformedProduct.options
        transformedProduct.option_ids = createdOptionsForProduct.map(
          (opt) => opt.id
        )

        processedProducts.push(transformedProduct)
      } else {
        processedProducts.push(product)
      }
    })

    return new StepResponse(processedProducts, createdOptionIds)
  },
  async (createdOptionIds, { container }) => {
    if (!createdOptionIds || createdOptionIds.length === 0) {
      return
    }

    const productService = container.resolve<IProductModuleService>(
      Modules.PRODUCT
    )

    await productService.deleteProductOptions(createdOptionIds)
  }
)
