import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createStoreInventoryStep } from "../steps/create-store-inventory"

export const createStoreInventoryWorkflow = createWorkflow(
  "create-store-inventory",
  (
    input: WorkflowData<{
      location_id: string
      material_id: string
      [key: string]: unknown
    }>
  ) => {
    const storeInventory = createStoreInventoryStep(input)
    return new WorkflowResponse(storeInventory)
  }
)
