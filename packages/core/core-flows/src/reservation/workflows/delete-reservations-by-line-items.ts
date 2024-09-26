import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"

import { deleteReservationsByLineItemsStep } from "../steps"

export type DeleteReservationByLineItemsWorkflowInput = { ids: string[] }

export const deleteReservationsByLineItemsWorkflowId =
  "delete-reservations-by-line-items"
/**
 * This workflow deletes reservations by their associated line items.
 */
export const deleteReservationsByLineItemsWorkflow = createWorkflow(
  deleteReservationsByLineItemsWorkflowId,
  (
    input: WorkflowData<DeleteReservationByLineItemsWorkflowInput>
  ): WorkflowData<void> => {
    return deleteReservationsByLineItemsStep(input.ids)
  }
)
