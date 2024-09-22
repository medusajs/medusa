import { WebhookActionResult } from "@medusajs/types"
import { createWorkflow, when } from "@medusajs/workflows-sdk"
import { completeCartWorkflow } from "../../cart"
import { useRemoteQueryStep } from "../../common"
import { useQueryStep } from "../../common/steps/use-query"

export const onPaymentProcessedWorkflowId = "on-payment-processed-workflow"
export const onPaymentProcessedWorkflow = createWorkflow(
  onPaymentProcessedWorkflowId,
  (input: WebhookActionResult) => {
    const paymentSessionResult = useRemoteQueryStep({
      entry_point: "payment_session",
      fields: ["payment_collection_id"],
      variables: { filters: { id: input.data?.session_id } },
      list: false,
    })

    const cartPaymentCollection = useQueryStep({
      entity: "cart_payment_collection",
      fields: ["cart_id"],
      filters: {
        payment_collection_id: paymentSessionResult.payment_collection_id,
      },
    })

    when({ cartPaymentCollection }, ({ cartPaymentCollection }) => {
      return !!cartPaymentCollection.data.length
    }).then(() => {
      completeCartWorkflow.runAsStep({
        input: {
          id: cartPaymentCollection.data[0].cart_id,
        },
      })
    })

    // TODO: Add more cases down the line, e.g. order payments
  }
)
