import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"

import { deleteReservationsByLineItemsStep } from "../steps"

/**
 * The data to delete reservations by their associated line items.
 */
export type DeleteReservationByLineItemsWorkflowInput = { 
  /**
   * The IDs of the line items to delete reservations for.
   */
  ids: string[]
}

export const deleteReservationsByLineItemsWorkflowId =
  "delete-reservations-by-line-items"
/**
 * This workflow deletes reservations by their associated line items.
 * 
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to delete reservations by their associated line items within your custom flows.
 * 
 * @example
 * const { result } = await deleteReservationsByLineItemsWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["orli_123"]
 *   }
 * })
 * 
 * @summary
 * 
 * Delete reservations by their associated line items.
 */
export const deleteReservationsByLineItemsWorkflow = createWorkflow(
  deleteReservationsByLineItemsWorkflowId,
  (
    input: WorkflowData<DeleteReservationByLineItemsWorkflowInput>
  ): WorkflowData<void> => {
    deleteReservationsByLineItemsStep(input.ids)
  }
)
