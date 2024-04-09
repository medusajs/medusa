import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"

import { WorkflowTypes } from "@medusajs/types"
import { createReservationsStep } from "../steps"

export const createReservationsWorkflowId = "create-reservations-workflow"
export const createReservationsWorkflow = createWorkflow(
  createReservationsWorkflowId,
  (
    input: WorkflowData<WorkflowTypes.ReservationWorkflow.CreateReservationsWorkflowInput>
  ): WorkflowData<WorkflowTypes.ReservationWorkflow.CreateReservationsWorkflowOutput> => {
    return createReservationsStep(input.reservations)
  }
)
