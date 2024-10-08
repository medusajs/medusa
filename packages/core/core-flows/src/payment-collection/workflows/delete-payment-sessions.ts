import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import {
  deletePaymentSessionsStep,
  validateDeletedPaymentSessionsStep,
} from "../steps"

export interface DeletePaymentSessionsWorkflowInput {
  ids: string[]
}

export const deletePaymentSessionsWorkflowId = "delete-payment-sessions"
/**
 * This workflow deletes one or more payment sessions.
 */
export const deletePaymentSessionsWorkflow = createWorkflow(
  deletePaymentSessionsWorkflowId,
  (input: WorkflowData<DeletePaymentSessionsWorkflowInput>) => {
    const idsDeleted = deletePaymentSessionsStep({ ids: input.ids })

    validateDeletedPaymentSessionsStep({
      idsToDelete: input.ids,
      idsDeleted,
    })

    return new WorkflowResponse(idsDeleted)
  }
)
