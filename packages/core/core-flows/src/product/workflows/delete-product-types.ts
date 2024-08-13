import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { deleteProductTypesStep } from "../steps"

export type DeleteProductTypesWorkflowInput = { ids: string[] }

export const deleteProductTypesWorkflowId = "delete-product-types"
/**
 * This workflow deletes one or more product types.
 */
export const deleteProductTypesWorkflow = createWorkflow(
  deleteProductTypesWorkflowId,
  (input: WorkflowData<DeleteProductTypesWorkflowInput>) => {
    const deletedProductTypes = deleteProductTypesStep(input.ids)
    const productTypesDeleted = createHook("productTypesDeleted", {
      ids: input.ids,
    })

    return new WorkflowResponse(deletedProductTypes, {
      hooks: [productTypesDeleted],
    })
  }
)
