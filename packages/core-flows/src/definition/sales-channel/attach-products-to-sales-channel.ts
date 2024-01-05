import { createWorkflow } from "@medusajs/workflows-sdk"

import { attachProductsToSalesChannelStep } from "../../handlers/sales-channel"

type WorkflowInput = {
  salesChannelId: string
  productIds: string[]
}

export const attachProductsToSalesChannelWorkflow = createWorkflow<
  WorkflowInput,
  void
>("create-sales-channels", function (input) {
  attachProductsToSalesChannelStep(input)
})
