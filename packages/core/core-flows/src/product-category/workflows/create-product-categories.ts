import { ProductCategoryWorkflow } from "@medusajs/framework/types"
import { ProductCategoryWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common"
import { createProductCategoriesStep } from "../steps"

export const createProductCategoriesWorkflowId = "create-product-categories"
/**
 * This workflow creates one or more product categories.
 */
export const createProductCategoriesWorkflow = createWorkflow(
  createProductCategoriesWorkflowId,
  (
    input: WorkflowData<ProductCategoryWorkflow.CreateProductCategoriesWorkflowInput>
  ) => {
    const createdProducts = createProductCategoriesStep(input)

    const productCategoryIdEvents = transform(
      { createdProducts },
      ({ createdProducts }) => {
        return createdProducts.map((v) => {
          return { id: v.id }
        })
      }
    )

    emitEventStep({
      eventName: ProductCategoryWorkflowEvents.CREATED,
      data: productCategoryIdEvents,
    })

    return new WorkflowResponse(createdProducts)
  }
)
