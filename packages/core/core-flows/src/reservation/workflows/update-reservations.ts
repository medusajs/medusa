import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"

import { WorkflowTypes } from "@medusajs/types"
import { updateReservationsStep } from "../steps"

export const updateReservationsWorkflowId = "update-reservations-workflow"
export const updateReservationsWorkflow = createWorkflow(
  updateReservationsWorkflowId,
  (
    input: WorkflowData<WorkflowTypes.ReservationWorkflow.UpdateReservationsWorkflowInput>
  ): WorkflowResponse<WorkflowTypes.ReservationWorkflow.UpdateReservationsWorkflowOutput> => {
    return new WorkflowResponse(updateReservationsStep(input.updates))
  }
)
