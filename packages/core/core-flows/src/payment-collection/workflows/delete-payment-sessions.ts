import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import {
  deletePaymentSessionsStep,
  validateDeletedPaymentSessionsStep,
} from "../steps"

interface WorkflowInput {
  ids: string[]
}

export const deletePaymentSessionsWorkflowId = "delete-payment-sessions"
export const deletePaymentSessionsWorkflow = createWorkflow(
  deletePaymentSessionsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const idsDeleted = deletePaymentSessionsStep({ ids: input.ids })

    validateDeletedPaymentSessionsStep({
      idsToDelete: input.ids,
      idsDeleted,
    })

    return new WorkflowResponse(idsDeleted)
  }
)
