import { SalesChannelDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { associateProductsWithSalesChannelsStep } from "../steps/associate-products-with-channels"

type WorkflowInput = {
  data: {
    sales_channel_id: string
    product_ids: string[]
  }[]
}

export const addProductsToSalesChannelsWorkflowId =
  "add-products-to-sales-channels"
export const addProductsToSalesChannelsWorkflow = createWorkflow(
  addProductsToSalesChannelsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<SalesChannelDTO[]> => {
    return associateProductsWithSalesChannelsStep({ links: input.data })
  }
)
