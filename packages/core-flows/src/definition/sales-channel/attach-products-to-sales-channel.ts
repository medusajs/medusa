import { createWorkflow } from "@medusajs/workflows-sdk"

import { attachProductsToSalesChannelStep } from "../../handlers/sales-channel"

type WorkflowInput = {
  salesChannelId: string
  productIds: string[]
}

export const attachProductsToSalesChannelWorkflow = createWorkflow<
  WorkflowInput,
  void
>("attach-product-to-sales-channels", function (input) {
  return attachProductsToSalesChannelStep(input)
})
