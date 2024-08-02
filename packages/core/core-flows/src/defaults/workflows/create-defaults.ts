import { createWorkflow, WorkflowResponse } from "@medusajs/workflows-sdk"
import { createDefaultSalesChannelStep } from "../../sales-channel"
import { createDefaultStoreStep } from "../steps/create-default-store"

export const createDefaultsWorkflowID = "create-defaults"
export const createDefaultsWorkflow = createWorkflow(
  createDefaultsWorkflowID,
  () => {
    const salesChannel = createDefaultSalesChannelStep({
      data: {
        name: "Default Sales Channel",
        description: "Created by Medusa",
      },
    })
    const store = createDefaultStoreStep({
      store: {
        default_sales_channel_id: salesChannel.id,
      },
    })

    return new WorkflowResponse(store)
  }
)
