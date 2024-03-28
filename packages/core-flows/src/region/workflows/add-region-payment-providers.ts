import { RegionWorkflow } from "@medusajs/types"
import { createWorkflow, WorkflowData } from "@medusajs/workflows-sdk"

export const addRegionPaymentProvidersWorkflowId =
  "add-region-payment-providers"
export const addRegionPaymentProvidersWorkflow = createWorkflow(
  addRegionPaymentProvidersWorkflowId,
  (
    input: WorkflowData<RegionWorkflow.AddRegionPaymentProvidersWorkflowInput[]>
  ): WorkflowData<void> => {}
)
