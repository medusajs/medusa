import { LinkWorkflowInput } from "@medusajs/framework/types"
import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { transform } from "@medusajs/framework/workflows-sdk"
import {
  associateLocationsWithSalesChannelsStep,
  detachLocationsFromSalesChannelsStep,
} from "../../sales-channel"

export const linkSalesChannelsToStockLocationWorkflowId =
  "link-sales-channels-to-stock-location"
/**
 * This workflow creates and dismisses links between location and sales channel records.
 */
export const linkSalesChannelsToStockLocationWorkflow = createWorkflow(
  linkSalesChannelsToStockLocationWorkflowId,
  (input: WorkflowData<LinkWorkflowInput>): void => {
    const toAdd = transform({ input }, (data) => {
      return data.input.add?.map((salesChannelId) => ({
        sales_channel_id: salesChannelId,
        location_id: data.input.id,
      }))
    })

    const toRemove = transform({ input }, (data) => {
      return data.input.remove?.map((salesChannelId) => ({
        sales_channel_id: salesChannelId,
        location_id: data.input.id,
      }))
    })

    associateLocationsWithSalesChannelsStep({ links: toAdd })
    detachLocationsFromSalesChannelsStep({ links: toRemove })
  }
)
