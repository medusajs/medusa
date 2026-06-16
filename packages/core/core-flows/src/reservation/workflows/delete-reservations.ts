import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"

import { deleteReservationsStep } from "../steps"

/**
 * The data to delete the reservations.
 */
type WorkflowInput = {
  /**
   * The IDs of the reservations to delete.
   */ 
  ids: string[]
}

export const deleteReservationsWorkflowId = "delete-reservations"
/**
 * This workflow deletes one or more reservations. It's used by the
 * [Delete Reservations Admin API Route](https://docs.medusajs.com/api/admin#reservations_deletereservationsid).
 * 
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to delete reservations in your custom flows.
 * 
 * @example
 * const { result } = await deleteReservationsWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["res_123"]
 *   }
 * })
 * 
 * @summary
 * 
 * Delete one or more reservations.
 */
export const deleteReservationsWorkflow = createWorkflow(
  deleteReservationsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    deleteReservationsStep(input.ids)
  }
)
