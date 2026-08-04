import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"

import type { WorkflowTypes } from "@medusajs/framework/types"
import { ReservationItemWorkflowEvents } from "@medusajs/framework/utils"
import { emitEventStep } from "../../common"
import { updateReservationsStep } from "../steps"

export const updateReservationsWorkflowId = "update-reservations-workflow"
/**
 * This workflow updates one or more reservations. It's used by the
 * [Update Reservations Admin API Route](https://docs.medusajs.com/api/admin/reservations/update-a-reservation).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to update reservations in your custom flows.
 *
 * @example
 * const { result } = await updateReservationsWorkflow(container)
 * .run({
 *   input: {
 *     updates: [
 *       {
 *         id: "res_123",
 *         quantity: 1,
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Update one or more reservations.
 */
export const updateReservationsWorkflow = createWorkflow(
  updateReservationsWorkflowId,
  (
    input: WorkflowData<WorkflowTypes.ReservationWorkflow.UpdateReservationsWorkflowInput>
  ): WorkflowResponse<WorkflowTypes.ReservationWorkflow.UpdateReservationsWorkflowOutput> => {
    const reservations = updateReservationsStep(input.updates)

    const reservationIdEvents = transform(
      { reservations },
      ({ reservations }) => {
        return reservations.map((reservation) => ({ id: reservation.id }))
      }
    )

    emitEventStep({
      eventName: ReservationItemWorkflowEvents.UPDATED,
      data: reservationIdEvents,
    })

    return new WorkflowResponse(reservations)
  }
)
