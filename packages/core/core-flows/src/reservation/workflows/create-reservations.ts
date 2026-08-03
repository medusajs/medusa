import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"

import type { WorkflowTypes } from "@medusajs/framework/types"
import { ReservationItemWorkflowEvents } from "@medusajs/framework/utils"
import { emitEventStep } from "../../common"
import { createReservationsStep } from "../steps"

export const createReservationsWorkflowId = "create-reservations-workflow"
/**
 * This workflow creates one or more reservations. It's used by the
 * [Create Reservations Admin API Route](https://docs.medusajs.com/api/admin/reservations/create-reservation).
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
    const reservations = createReservationsStep(input.reservations)

    const reservationIdEvents = transform(
      { reservations },
      ({ reservations }) => {
        return reservations.map((reservation) => ({ id: reservation.id }))
      }
    )

    emitEventStep({
      eventName: ReservationItemWorkflowEvents.CREATED,
      data: reservationIdEvents,
    })

    return new WorkflowResponse(reservations)
  }
)
