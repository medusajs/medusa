import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteServiceZonesStep } from "../steps"

export const deleteServiceZonesWorkflowId = "delete-service-zones-workflow"
export const deleteServiceZonesWorkflow = createWorkflow(
  deleteServiceZonesWorkflowId,
  (input: WorkflowData<{ ids: string[] }>) => {
    deleteServiceZonesStep(input.ids)
  }
)
