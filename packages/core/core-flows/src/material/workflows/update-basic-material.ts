import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateBasicMaterialStep } from "../steps/update-basic-material"

export const updateBasicMaterialWorkflow = createWorkflow(
  "update-basic-material",
  (input: WorkflowData<{ id: string; [key: string]: unknown }>) => {
    const basicMaterial = updateBasicMaterialStep(input)
    return new WorkflowResponse(basicMaterial)
  }
)
