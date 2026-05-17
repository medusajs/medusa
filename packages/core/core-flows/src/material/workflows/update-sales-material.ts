import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateSalesMaterialStep } from "../steps/update-sales-material"

export const updateSalesMaterialWorkflow = createWorkflow(
  "update-sales-material",
  (input: WorkflowData<{ id: string; [key: string]: unknown }>) => {
    const salesMaterial = updateSalesMaterialStep(input)
    return new WorkflowResponse(salesMaterial)
  }
)
