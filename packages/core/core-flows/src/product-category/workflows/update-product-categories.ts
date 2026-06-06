import {
  ProductCategoryDTO,
  ProductCategoryWorkflow,
} from "@zjedene-medusa/framework/types"
import { ProductCategoryWorkflowEvents } from "@zjedene-medusa/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
  createHook,
} from "@zjedene-medusa/framework/workflows-sdk"
import { emitEventStep } from "../../common"
import { updateProductCategoriesStep } from "../steps"

/**
 * The updated product categories.
 */
export type UpdateProductCategoriesWorkflowOutput = ProductCategoryDTO[]

export const updateProductCategoriesWorkflowId = "update-product-categories"
/**
 * This workflow updates product categories matching specified filters. It's used by the
 * [Update Product Category Admin API Route](https://docs.medusajs.com/api/admin#product-categories_postproductcategoriesid).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * update product categories within your custom flows.
 *
 * @example
 * const { result } = await updateProductCategoriesWorkflow(container)
 * .run({
 *   input: {
 *     selector: {
 *       id: "pcat_123",
 *     },
 *     update: {
 *       name: "Shoes",
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Update product categories.
 */
export const updateProductCategoriesWorkflow = createWorkflow(
  updateProductCategoriesWorkflowId,
  (
    input: WorkflowData<ProductCategoryWorkflow.UpdateProductCategoriesWorkflowInput>
  ) => {
    const updatedCategories = updateProductCategoriesStep(input)

    const productCategoryIdEvents = transform(
      { updatedCategories },
      ({ updatedCategories }) => {
        const arr = Array.isArray(updatedCategories)
          ? updatedCategories
          : [updatedCategories]

        return arr?.map((v) => {
          return { id: v.id }
        })
      }
    )

    emitEventStep({
      eventName: ProductCategoryWorkflowEvents.UPDATED,
      data: productCategoryIdEvents,
    })

    const categoriesUpdated = createHook("categoriesUpdated", {
      categories: updatedCategories,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(updatedCategories, {
      hooks: [categoriesUpdated],
    })
  }
)
