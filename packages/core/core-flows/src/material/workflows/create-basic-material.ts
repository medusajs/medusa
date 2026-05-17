import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createBasicMaterialStep } from "../steps/create-basic-material"

export const createBasicMaterialWorkflow = createWorkflow(
  "create-basic-material",
  (
    input: WorkflowData<{
      material_code: string
      material_name: string
      [key: string]: unknown
    }>
  ) => {
    const basicMaterial = createBasicMaterialStep(input)
    return new WorkflowResponse(basicMaterial)
  }
)
