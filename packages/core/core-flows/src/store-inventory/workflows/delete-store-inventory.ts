import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteStoreInventoryStep } from "../steps/delete-store-inventory"

export const deleteStoreInventoryWorkflow = createWorkflow(
  "delete-store-inventory",
  (input: WorkflowData<{ id: string }>) => {
    deleteStoreInventoryStep(input)
    return new WorkflowResponse(void 0)
  }
)
