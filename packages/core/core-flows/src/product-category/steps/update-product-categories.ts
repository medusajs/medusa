import {
  FilterableProductCategoryProps,
  IProductModuleService,
  UpdateProductCategoryDTO,
} from "@zjedene-medusa/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to update the product categories.
 */
export type UpdateProductCategoriesStepInput = {
  /**
   * The filters to select the product categories to update.
   */
  selector: FilterableProductCategoryProps
  /**
   * The data to update in the product categories.
   */
  update: UpdateProductCategoryDTO
}

export const updateProductCategoriesStepId = "update-product-categories"
/**
 * This step updates product categories matching specified filters.
 * 
 * @example
 * const data = updateProductCategoriesStep({
 *   selector: {
 *     id: "pcat_123",
 *   },
 *   update: {
 *     name: "Shoes",
 *   }
 * })
 */
export const updateProductCategoriesStep = createStep(
  updateProductCategoriesStepId,
  async (data: UpdateProductCategoriesStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.listProductCategories(data.selector, {
      select: selects,
      relations,
    })

    const productCategories = await service.updateProductCategories(
      data.selector,
      data.update
    )
    return new StepResponse(productCategories, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.upsertProductCategories(prevData)
  }
)
