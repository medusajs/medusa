import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@zjedene-medusa/framework/workflows-sdk"

import type { WorkflowTypes } from "@zjedene-medusa/framework/types"
import { createReservationsStep } from "../steps"

export const createReservationsWorkflowId = "create-reservations-workflow"
/**
 * This workflow creates one or more reservations. It's used by the
 * [Create Reservations Admin API Route](https://docs.medusajs.com/api/admin#reservations_postreservations).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to create reservations in your custom flows.
 *
 * @example
 * const { result } = await createReservationsWorkflow(container)
 * .run({
 *   input: {
 *     reservations: [
 *       {
 *         inventory_item_id: "iitem_123",
 *         location_id: "sloc_123",
 *         quantity: 1,
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Create one or more reservations.
 */
export const createReservationsWorkflow = createWorkflow(
  createReservationsWorkflowId,
  (
    input: WorkflowData<WorkflowTypes.ReservationWorkflow.CreateReservationsWorkflowInput>
  ): WorkflowResponse<WorkflowTypes.ReservationWorkflow.CreateReservationsWorkflowOutput> => {
    return new WorkflowResponse(createReservationsStep(input.reservations))
  }
)
