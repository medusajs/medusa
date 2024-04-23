import { LinkWorkflowInput } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { transform } from "@medusajs/workflows-sdk"
import {
  associateLocationsWithSalesChannelsStep,
  detachLocationsFromSalesChannelsStep,
} from "../../sales-channel"

export const linkSalesChannelsToStockLocationWorkflowId =
  "link-sales-channels-to-stock-location"
export const linkSalesChannelsToStockLocationWorkflow = createWorkflow(
  linkSalesChannelsToStockLocationWorkflowId,
  (input: WorkflowData<LinkWorkflowInput>): WorkflowData<void> => {
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
