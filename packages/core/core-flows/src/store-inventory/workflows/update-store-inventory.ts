import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateStoreInventoryStep } from "../steps/update-store-inventory"

export const updateStoreInventoryWorkflow = createWorkflow(
  "update-store-inventory",
  (input: WorkflowData<{ id: string; [key: string]: unknown }>) => {
    const storeInventory = updateStoreInventoryStep(input)
    return new WorkflowResponse(storeInventory)
  }
)
