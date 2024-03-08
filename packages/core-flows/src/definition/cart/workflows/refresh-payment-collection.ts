import {
  StepResponse,
  WorkflowData,
  createStep,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common/steps/use-remote-query"
import {
  deletePaymentSessionStep,
  updatePaymentCollectionStep,
} from "../../payment-collection"

type WorklowInput = {
  cart_id: string
}

interface StepInput {
  cart_id: string
}

// We export a step running the workflow too, so that we can use it as a subworkflow e.g. in the update cart workflows
export const refreshPaymentCollectionForCartStepId =
  "refresh-payment-collection-for-cart"
export const refreshPaymentCollectionForCartStep = createStep(
  refreshPaymentCollectionForCartStepId,
  async (data: StepInput, { container }) => {
    await refreshPaymentCollectionForCartWorkflow(container).run({
      input: {
        cart_id: data.cart_id,
      },
    })

    return new StepResponse(null)
  }
)

export const refreshPaymentCollectionForCartWorkflowId =
  "refresh-payment-collection-for-cart"
export const refreshPaymentCollectionForCartWorkflow = createWorkflow(
  refreshPaymentCollectionForCartWorkflowId,
  (input: WorkflowData<WorklowInput>): WorkflowData<void> => {
    const carts = useRemoteQueryStep({
      entry_point: "cart",
      fields: [
        "id",
        "total",
        "currency_code",
        "payment_collection.id",
        "payment_collection.payment_sessions.id",
      ],
      variables: { id: input.cart_id },
    })

    deletePaymentSessionStep({
      payment_session_id: carts[0].payment_collection.payment_sessions?.[0].id,
    })

    // TODO: Temporary fixed cart total, so we can test the workflow.
    //  This will be removed when the totals utilities are built.
    const cartTotal = 4242

    updatePaymentCollectionStep({
      selector: { id: carts[0].payment_collection.id },
      update: {
        amount: cartTotal,
        currency_code: carts[0].currency_code,
      },
    })
  }
)
