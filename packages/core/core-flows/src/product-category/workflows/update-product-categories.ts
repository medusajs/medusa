import { ProductCategoryWorkflow } from "@medusajs/types"
import { ProductCategoryWorkflowEvents } from "@medusajs/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { emitEventStep } from "../../common"
import { updateProductCategoriesStep } from "../steps"

export const updateProductCategoriesWorkflowId = "update-product-categories"
/**
 * This workflow updates product categories matching specified filters.
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

    return new WorkflowResponse(updatedCategories)
  }
)
