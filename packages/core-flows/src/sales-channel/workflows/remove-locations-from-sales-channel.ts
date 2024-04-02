import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"

import { removeLocationsFromSalesChannelStep } from "../steps"

interface WorkflowInput {
  data: {
    sales_channel_id: string
    location_ids: string[]
  }[]
}

export const removeLocationsToSalesChannelWorkflowId =
  "remove-locations-to-sales-channel"
export const removeLocationsToSalesChannelWorkflow = createWorkflow(
  removeLocationsToSalesChannelWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    removeLocationsFromSalesChannelStep(input.data)
  }
)
