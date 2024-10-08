import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"

import { deleteReservationsStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteReservationsWorkflowId = "delete-reservations"
/**
 * This workflow deletes one or more reservations.
 */
export const deleteReservationsWorkflow = createWorkflow(
  deleteReservationsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteReservationsStep(input.ids)
  }
)
