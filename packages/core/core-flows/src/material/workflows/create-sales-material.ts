import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createSalesMaterialStep } from "../steps/create-sales-material"

export const createSalesMaterialWorkflow = createWorkflow(
  "create-sales-material",
  (
    input: WorkflowData<{
      shop_id: string
      sales_code: string
      sales_name: string
      [key: string]: unknown
    }>
  ) => {
    const salesMaterial = createSalesMaterialStep(input)
    return new WorkflowResponse(salesMaterial)
  }
)
