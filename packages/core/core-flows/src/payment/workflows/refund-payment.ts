import { BigNumberInput, OrderDTO, PaymentDTO } from "@medusajs/framework/types"
import { MathBN, MedusaError, PaymentEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep, useRemoteQueryStep } from "../../common"
import { addOrderTransactionStep } from "../../order/steps/add-order-transaction"
import { refundPaymentStep } from "../steps/refund-payment"

/**
 * This step validates that the refund is valid for the order
 */
export const validateRefundStep = createStep(
  "validate-refund-step",
  async function ({
    order,
    payment,
    amount,
  }: {
    order: OrderDTO
    payment: PaymentDTO
    amount?: BigNumberInput
  }) {
    const pendingDifference = order.summary?.raw_pending_difference!

    if (MathBN.gte(pendingDifference, 0)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Order does not have an outstanding balance to refund`
      )
    }

    const amountPending = MathBN.mult(pendingDifference, -1)
    const amountToRefund = amount ?? payment.raw_amount ?? payment.amount

    if (MathBN.gt(amountToRefund, amountPending)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot refund more than pending difference - ${amountPending}`
      )
    }
  }
)

export const refundPaymentWorkflowId = "refund-payment-workflow"
/**
 * This workflow refunds a payment.
 */
export const refundPaymentWorkflow = createWorkflow(
  refundPaymentWorkflowId,
  (
    input: WorkflowData<{
      payment_id: string
      created_by?: string
      amount?: BigNumberInput
    }>
  ) => {
    const payment = useRemoteQueryStep({
      entry_point: "payment",
      fields: [
        "id",
        "payment_collection_id",
        "currency_code",
        "amount",
        "raw_amount",
      ],
      variables: { id: input.payment_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const orderPaymentCollection = useRemoteQueryStep({
      entry_point: "order_payment_collection",
      fields: ["order.id"],
      variables: { payment_collection_id: payment.payment_collection_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-payment-collection" })

    const order = useRemoteQueryStep({
      entry_point: "order",
      fields: ["id", "summary", "currency_code", "region_id"],
      variables: { id: orderPaymentCollection.order.id },
      throw_if_key_not_found: true,
      list: false,
    }).config({ name: "order" })

    validateRefundStep({ order, payment, amount: input.amount })
    refundPaymentStep(input)

    when({ orderPaymentCollection }, ({ orderPaymentCollection }) => {
      return !!orderPaymentCollection?.order?.id
    }).then(() => {
      const orderTransactionData = transform(
        { input, payment, orderPaymentCollection },
        ({ input, payment, orderPaymentCollection }) => {
          return {
            order_id: orderPaymentCollection.order.id,
            amount: MathBN.mult(
              input.amount ?? payment.raw_amount ?? payment.amount,
              -1
            ),
            currency_code: payment.currency_code ?? order.currency_code,
            reference_id: payment.id,
            reference: "refund",
          }
        }
      )

      addOrderTransactionStep(orderTransactionData)
    })

    emitEventStep({
      eventName: PaymentEvents.REFUNDED,
      data: { id: payment.id },
    })

    return new WorkflowResponse(payment)
  }
)
