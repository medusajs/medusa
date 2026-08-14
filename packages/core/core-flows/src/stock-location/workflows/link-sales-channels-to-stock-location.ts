import type { LinkWorkflowInput } from "@medusajs/framework/types"
import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { transform } from "@medusajs/framework/workflows-sdk"
import {
  associateLocationsWithSalesChannelsStep,
  detachLocationsFromSalesChannelsStep,
} from "../../sales-channel"

/**
 * The sales channels to manage for a stock location.
 *
 * @property id - The ID of the stock location.
 * @property add - The IDs of the sales channels to add to the stock location.
 * @property remove - The IDs of the sales channels to remove from the stock location.
 */
export type LinkSalesChannelsToStockLocationWorkflowInput = LinkWorkflowInput

export const linkSalesChannelsToStockLocationWorkflowId =
  "link-sales-channels-to-stock-location"
/**
 * This workflow manages the sales channels of a stock location. It's used by the
 * [Manage Sales Channels Admin API Route](https://docs.medusajs.com/api/admin/stock-locations/manage-sales-channels).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to manage the sales channels of a stock location in your custom flows.
 *
 * @example
 * const { result } = await linkSalesChannelsToStockLocationWorkflow(container)
 * .run({
 *   input: {
 *     id: "sloc_123",
 *     add: ["sc_123"],
 *     remove: ["sc_321"]
 *   }
 * })
 *
 * @summary
 *
 * Manage the sales channels of a stock location.
 */
export const linkSalesChannelsToStockLocationWorkflow = createWorkflow(
  linkSalesChannelsToStockLocationWorkflowId,
  (
    input: WorkflowData<LinkSalesChannelsToStockLocationWorkflowInput>
  ): void => {
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
