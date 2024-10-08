import { LinkWorkflowInput } from "@medusajs/framework/types"
import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { associateProductsWithSalesChannelsStep } from "../steps/associate-products-with-channels"
import { transform } from "@medusajs/framework/workflows-sdk"
import { detachProductsFromSalesChannelsStep } from "../steps"

export const linkProductsToSalesChannelWorkflowId =
  "link-products-to-sales-channel"
/**
 * This workflow creates or dismisses links between product and sales channel records.
 */
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
