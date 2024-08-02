import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { deleteProductTypesStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteProductTypesWorkflowId = "delete-product-types"
export const deleteProductTypesWorkflow = createWorkflow(
  deleteProductTypesWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const deletedProductTypes = deleteProductTypesStep(input.ids)
    const productTypesDeleted = createHook("productTypesDeleted", {
      ids: input.ids,
    })

    return new WorkflowResponse(deletedProductTypes, {
      hooks: [productTypesDeleted],
    })
  }
)
