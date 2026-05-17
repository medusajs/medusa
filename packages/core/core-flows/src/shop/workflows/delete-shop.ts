import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteShopStep } from "../steps/delete-shop"

export const deleteShopWorkflow = createWorkflow(
  "delete-shop",
  (input: WorkflowData<{ id: string }>) => {
    deleteShopStep(input)
    return new WorkflowResponse(void 0)
  }
)
