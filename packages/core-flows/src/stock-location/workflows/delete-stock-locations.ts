import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"

import { deleteStockLocationsStep } from "../steps"

interface WorkflowInput {
  ids: string[]
}

export const deleteStockLocationsWorkflowId = "delete-stock-locations-workflow"
export const deleteStockLocationsWorkflow = createWorkflow(
  deleteStockLocationsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    deleteStockLocationsStep(input.ids)

    // TODO: deatach links
  }
)
