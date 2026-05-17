import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createShopStep } from "../steps/create-shop"

export const createShopWorkflow = createWorkflow(
  "create-shop",
  (
    input: WorkflowData<{
      shop_code: string
      shop_name: string
      platform_type: string
      [key: string]: unknown
    }>
  ) => {
    const shop = createShopStep(input)
    return new WorkflowResponse(shop)
  }
)
