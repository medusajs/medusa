import type {
  IProductModuleService,
  ProductTypes,
  UpdateProductWorkflowInputDTO,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { deepCopy } from "@medusajs/framework/utils"

export const processProductOptionsForImportStepId =
  "process-product-options-for-import"

/**
 * A product option entry from the import payload. When `id` is set, the
 * product is linked to that existing option. Otherwise, a new option is
 * created — defaulting to `is_exclusive: true` unless the import explicitly
 * sets it to `false`.
 *
 * @since 2.18.0
 */
export type ImportProductOptionInput = ProductTypes.CreateProductOptionDTO & {
  id?: string
}

/**
 * The data to process products with options during import.
 */
export type ProcessProductOptionsForImportInput = {
  /**
   * The products to process. Each product can optionally have an `options` field
   * referencing existing options by id or describing new options to create.
   */
  products: (Omit<UpdateProductWorkflowInputDTO, "option_ids"> & {
    /**
     * The product options to attach (when `id` is set) or create (when `id`
     * is absent) for the product.
     */
    options?: ImportProductOptionInput[]
  })[]
}

/**
 * This step processes products with options during import. It performs the following actions:
 *
 * 1. Links products to existing options when an `id` is provided on the option entry.
 * 2. Creates new options for entries without an `id`, defaulting to `is_exclusive: true` unless the entry specifies otherwise.
 * 3. Transforms `product.options` in the input to `product.option_ids`.
 *
 * @since 2.16.0
 *
 * @example
 * const data = processProductOptionsForImportStep({
 *   products: [
 *     {
 *       title: "T-Shirt",
 *       options: [
 *         // Reuse an existing (typically global) option:
 *         { id: "opt_existing", title: "Size", values: ["S", "M", "L"] },
 *         // Or create a new exclusive option (the default):
 *         { title: "Color", values: ["Red", "Blue"] },
 *       ],
 *       variants: [
 *         {
 *           title: "T-Shirt - Small / Red",
 *           options: { Size: "S", Color: "Red" }
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

    // Walk every product's options once: each option either references an
    // existing id (link) or is queued for creation. Track the (product,
    // option) coordinates of every queued entry so we can splice the
    // newly-created ids back into the right slot after the create call.
    const optionsToCreate: ProductTypes.CreateProductOptionDTO[] = []
    const createTargets: { productIndex: number; optionIndex: number }[] = []

    data.products.forEach((product, productIndex) => {
      ;(product.options ?? []).forEach((option, optionIndex) => {
        if (option.id) {
          return
        }
        const { id: _unusedId, ...rest } = option
        optionsToCreate.push({
          ...rest,
          is_exclusive: option.is_exclusive ?? true,
        })
        createTargets.push({ productIndex, optionIndex })
      })
    })

    const createdOptions =
      optionsToCreate.length > 0
        ? await productService.createProductOptions(optionsToCreate)
        : []
    const createdOptionIds = createdOptions.map((opt) => opt.id)

    const createdIdByCoord = new Map<string, string>()
    createdOptions.forEach((opt, idx) => {
      const { productIndex, optionIndex } = createTargets[idx]
      createdIdByCoord.set(`${productIndex}:${optionIndex}`, opt.id)
    })

    data.products.forEach((product, productIndex) => {
      const options = product.options ?? []
      const optionIds = options
        .map((opt, optionIndex) =>
          opt.id ?? createdIdByCoord.get(`${productIndex}:${optionIndex}`)
        )
        .filter((id): id is string => !!id)

      if (optionIds.length) {
        const transformedProduct: any = deepCopy(product)
        delete transformedProduct.options
        transformedProduct.option_ids = optionIds
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
