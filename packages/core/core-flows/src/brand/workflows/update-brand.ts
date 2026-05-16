import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateBrandStep } from "../steps/update-brand"

export const updateBrandWorkflow = createWorkflow(
  "update-brand",
  (input: WorkflowData<{ id: string; [key: string]: unknown }>) => {
    const brand = updateBrandStep(input)
    return new WorkflowResponse(brand)
  }
)
