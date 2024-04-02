import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"

import { removeLocationsFromSalesChannelStep } from "../steps"

interface WorkflowInput {
  data: {
    sales_channel_id: string
    location_ids: string[]
  }[]
}

export const removeLocationsFromSalesChannelWorkflowId =
  "remove-locations-from-sales-channel"
export const removeLocationsFromSalesChannelWorkflow = createWorkflow(
  removeLocationsFromSalesChannelWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    removeLocationsFromSalesChannelStep(input.data)
  }
)
