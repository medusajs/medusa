import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateShopStep } from "../steps/update-shop"

export const updateShopWorkflow = createWorkflow(
  "update-shop",
  (input: WorkflowData<{ id: string; [key: string]: unknown }>) => {
    const shop = updateShopStep(input)
    return new WorkflowResponse(shop)
  }
)
