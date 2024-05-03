import { LinkWorkflowInput } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { associateProductsWithSalesChannelsStep } from "../steps/associate-products-with-channels"
import { transform } from "@medusajs/workflows-sdk"
import { detachProductsFromSalesChannelsStep } from "../steps"

export const linkProductsToSalesChannelWorkflowId =
  "link-products-to-sales-channel"
export const linkProductsToSalesChannelWorkflow = createWorkflow(
  linkProductsToSalesChannelWorkflowId,
  (input: WorkflowData<LinkWorkflowInput>): WorkflowData<void> => {
    const toAdd = transform({ input }, (data) => {
      return data.input.add?.map((productId) => ({
        sales_channel_id: data.input.id,
        product_id: productId,
      }))
    })

    const toRemove = transform({ input }, (data) => {
      return data.input.remove?.map((productId) => ({
        sales_channel_id: data.input.id,
        product_id: productId,
      }))
    })

    associateProductsWithSalesChannelsStep({ links: toAdd })
    detachProductsFromSalesChannelsStep({ links: toRemove })
  }
)
