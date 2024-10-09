import { WebhookActionResult } from "@medusajs/types"
import { PaymentActions } from "@medusajs/utils"
import { createWorkflow, when } from "@medusajs/workflows-sdk"
import { useQueryStep } from "../../common/steps/use-query"
import { authorizePaymentSessionStep } from "../steps"
import { capturePaymentWorkflow } from "./capture-payment"

interface ProcessPaymentWorkflowInput extends WebhookActionResult {}

export const processPaymentWorkflowId = "process-payment-workflow"
export const processPaymentWorkflow = createWorkflow(
  processPaymentWorkflowId,
  (input: ProcessPaymentWorkflowInput) => {
    const paymentData = useQueryStep({
      entity: "payment",
      fields: ["id"],
      filters: { payment_session_id: input.data?.session_id },
    })

    when({ input }, ({ input }) => {
      return (
        input.action === PaymentActions.SUCCESSFUL && !!paymentData.data.length
      )
    }).then(() => {
      capturePaymentWorkflow.runAsStep({
        input: {
          payment_id: paymentData.data[0].id,
          amount: input.data?.amount,
        },
      })
    })

    when({ input }, ({ input }) => {
      return (
        input.action === PaymentActions.AUTHORIZED && !!input.data?.session_id
      )
    }).then(() => {
      authorizePaymentSessionStep({
        id: input.data!.session_id,
        context: {},
      })
    })
  }
)
