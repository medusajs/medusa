import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"

import { deleteReservationsByLineItemsStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteReservationsByLineItemsWorkflowId =
  "delete-reservations-by-line-items"
export const deleteReservationsByLineItemsWorkflow = createWorkflow(
  deleteReservationsByLineItemsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteReservationsByLineItemsStep(input.ids)
  }
)
