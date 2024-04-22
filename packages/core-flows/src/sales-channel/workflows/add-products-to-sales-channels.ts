import { SalesChannelDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { associateProductsWithSalesChannelsStep } from "../steps/associate-products-with-channels"
import { transform } from "@medusajs/workflows-sdk"

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
    const links = transform({ input }, (data) => {
      return data.input.data
        .map(({ sales_channel_id, product_ids }) => {
          return product_ids.map((product_id) => {
            return {
              sales_channel_id,
              product_id,
            }
          })
        })
        .flat()
    })

    return associateProductsWithSalesChannelsStep({ links })
  }
)
