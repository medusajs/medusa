import { SalesChannelDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { detachProductsFromSalesChannelsStep } from "../steps/detach-products-from-sales-channels"

type WorkflowInput = {
  data: {
    sales_channel_id: string
    product_ids: string[]
  }[]
}

export const removeProductsFromSalesChannelsWorkflowId =
  "remove-products-from-sales-channels"
export const removeProductsFromSalesChannelsWorkflow = createWorkflow(
  removeProductsFromSalesChannelsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<SalesChannelDTO[]> => {
    return detachProductsFromSalesChannelsStep({ links: input.data })
  }
)
