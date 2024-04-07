import { SalesChannelDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { detachProductsFromSalesChannelsStep } from "../steps/detach-products-from-sales-channels"
import { transform } from "@medusajs/workflows-sdk"

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

    return detachProductsFromSalesChannelsStep({ links })
  }
)
