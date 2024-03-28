import { createWorkflow, WorkflowData } from "@medusajs/workflows-sdk"

type WorkflowInput = { region_id: string; payment_provider_id: string[] }[]

export const deleteRegionPaymentProvidersWorkflowId =
  "delete-region-payment-providers"
export const deleteRegionPaymentProvidersWorkflow = createWorkflow(
  deleteRegionPaymentProvidersWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {}
)
