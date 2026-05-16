import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createBrandStep } from "../steps/create-brand"

export const createBrandWorkflow = createWorkflow(
  "create-brand",
  (input: WorkflowData<{ name: string; slug: string; [key: string]: unknown }>) => {
    const brand = createBrandStep(input)
    return new WorkflowResponse(brand)
  }
)
