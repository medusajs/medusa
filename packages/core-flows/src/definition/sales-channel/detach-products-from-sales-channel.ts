import { createWorkflow } from "@medusajs/workflows-sdk"

import { detachProductsToSalesChannelStep } from "../../handlers/sales-channel"

type WorkflowInput = {
  salesChannelId: string
  productIds: string[]
}

export const detachProductsFromSalesChannelWorkflow = createWorkflow<
  WorkflowInput,
  void
>("detach-products-from-sales-channels", function (input) {
  return detachProductsToSalesChannelStep(input)
})
