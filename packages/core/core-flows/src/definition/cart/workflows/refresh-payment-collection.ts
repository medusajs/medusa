import { isPresent } from "@medusajs/utils"
import {
  StepResponse,
  WorkflowData,
  createStep,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common/steps/use-remote-query"
import { updatePaymentCollectionStep } from "../../../payment-collection"
import { deletePaymentSessionsWorkflow } from "../../../payment-collection/workflows/delete-payment-sessions"

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
    const cart = useRemoteQueryStep({
      entry_point: "cart",
      fields: [
        "id",
        "total",
        "currency_code",
        "payment_collection.id",
        "payment_collection.payment_sessions.id",
      ],
      variables: { id: input.cart_id },
      throw_if_key_not_found: true,
      list: false,
    })

    const deletePaymentSessionInput = transform(
      { paymentCollection: cart.payment_collection },
      (data) => {
        return {
          ids:
            data.paymentCollection?.payment_sessions
              ?.map((ps) => ps.id)
              ?.flat(1) || [],
        }
      }
    )

    const updatePaymentCollectionInput = transform({ cart }, (data) => {
      if (!isPresent(data.cart?.payment_collection?.id)) {
        return
      }

      return {
        selector: { id: data.cart.payment_collection.id },
        update: {
          amount: data.cart.total,
          currency_code: data.cart.currency_code,
        },
      }
    })

    parallelize(
      deletePaymentSessionsWorkflow.runAsStep({
        input: deletePaymentSessionInput,
      }),
      updatePaymentCollectionStep(updatePaymentCollectionInput)
    )
  }
)
