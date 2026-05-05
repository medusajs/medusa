import { BigNumberInput, PaymentDTO } from "@medusajs/framework/types"
import {
  BigNumber,
  defaultCurrencies,
  getEpsilonFromDecimalPrecision,
  MathBN,
  MedusaError,
  PaymentEvents,
} from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep, useRemoteQueryStep } from "../../common"
import { addOrderTransactionStep } from "../../order/steps/add-order-transaction"
import { createOrderRefundCreditLinesWorkflow } from "../../order/workflows/payments/create-order-refund-credit-lines"
import { refundPaymentStep } from "../steps/refund-payment"

/**
 * The data to refund a payment.
 */
export type RefundPaymentWorkflowInput = {
  /**
   * The ID of the payment to refund.
   */
  payment_id: string
  /**
   * The ID of the user that refunded the payment.
   */
  created_by?: string
  /**
   * The amount to refund. If not provided, the full payment amount will be refunded.
   */
  amount?: BigNumberInput
  /**
   * The note to attach to the refund.
   */
  note?: string
  /**
   * The ID of the refund reason to attach to the refund.
   */
  refund_reason_id?: string
}

/**
 * This step validates that an order refund credit line can be issued
 */
export const validateRefundPaymentExceedsCapturedAmountStep = createStep(
  "validate-refund-payment-exceeds-captured-amount",
  async function ({
    payment,
    refundAmount,
  }: {
    payment: PaymentDTO
    refundAmount: BigNumberInput
  }) {
    const capturedAmount = (payment.captures || []).reduce(
      (captureAmount, next) => {
        const amountAsBigNumber = new BigNumber(
          next.raw_amount as BigNumberInput
        )
        return MathBN.add(captureAmount, amountAsBigNumber)
      },
      MathBN.convert(0)
    )

    const refundedAmount = (payment.refunds || []).reduce(
      (refundedAmount, next) => {
        const amountAsBigNumber = new BigNumber(
          next.raw_amount as BigNumberInput
        )
        return MathBN.add(refundedAmount, amountAsBigNumber)
      },
      MathBN.convert(0)
    )

    const totalRefundedAmount = MathBN.add(refundedAmount, refundAmount)

    const upperCurCode = payment.currency_code?.toUpperCase() as string
    const currencyEpsilon = getEpsilonFromDecimalPrecision(
      defaultCurrencies[upperCurCode]?.decimal_digits
    )

    if (
      MathBN.lt(
        MathBN.sub(capturedAmount, totalRefundedAmount),
        -currencyEpsilon
      )
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `You are not allowed to refund more than the captured amount`
      )
    }
  }
)

export const refundPaymentWorkflowId = "refund-payment-workflow"
/**
 * This workflow refunds a payment. It's used by the
 * [Refund Payment Admin API Route](https://docs.medusajs.com/api/admin#payments_postpaymentsidrefund).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to refund a payment in your custom flows.
 *
 * @example
 * const { result } = await refundPaymentWorkflow(container)
 * .run({
 *   input: {
 *     payment_id: "payment_123",
 *   }
 * })
 *
 * @summary
 *
 * Refund a payment.
 */
export const refundPaymentWorkflow = createWorkflow(
  refundPaymentWorkflowId,
  (input: WorkflowData<RefundPaymentWorkflowInput>) => {
    const payment = useRemoteQueryStep({
      entry_point: "payment",
      fields: [
        "id",
        "payment_collection_id",
        "currency_code",
        "amount",
        "raw_amount",
        "captures.raw_amount",
        "refunds.raw_amount",
      ],
      variables: { id: input.payment_id },
      list: false,
      throw_if_key_not_found: true,
    })

    when({ input }, ({ input }) => !!input.amount).then(() =>
      validateRefundPaymentExceedsCapturedAmountStep({
        payment,
        refundAmount: input.amount as BigNumberInput,
      })
    )

    const orderPaymentCollection = useRemoteQueryStep({
      entry_point: "order_payment_collection",
      fields: ["order.id"],
      variables: { payment_collection_id: payment.payment_collection_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-payment-collection" })

    const order = useRemoteQueryStep({
      entry_point: "order",
      fields: ["id", "summary", "total", "currency_code", "region_id"],
      variables: { id: orderPaymentCollection.order.id },
      throw_if_key_not_found: true,
      list: false,
    }).config({ name: "order" })

    const refundReason = when(
      "fetch-refund-reason",
      { input },
      ({ input }) => !!input.refund_reason_id
    ).then(() => {
      return useRemoteQueryStep({
        entry_point: "refund_reason",
        fields: ["id", "label", "code"],
        variables: { id: input.refund_reason_id },
        list: false,
        throw_if_key_not_found: true,
      }).config({ name: "refund-reason" })
    })

    const refundPayment = refundPaymentStep(input)

    const creditLineAmount = transform(
      { order, payment, input },
      ({ order, payment, input }) => {
        const pendingDifference =
          order.summary?.raw_pending_difference! ??
          order.summary?.pending_difference! ??
          0
        const amountToRefund =
          input.amount ?? payment.raw_amount ?? payment.amount

        if (MathBN.lt(pendingDifference, 0)) {
          const amountOwed = MathBN.mult(pendingDifference, -1)

          return MathBN.gt(amountToRefund, amountOwed)
            ? MathBN.sub(amountToRefund, amountOwed)
            : 0
        }

        return amountToRefund
      }
    )

    when({ orderPaymentCollection }, ({ orderPaymentCollection }) => {
      return !!orderPaymentCollection?.order?.id
    }).then(() => {
      const orderTransactionData = transform(
        { input, refundPayment, orderPaymentCollection, order },
        ({ input, refundPayment, orderPaymentCollection, order }) => {
          return refundPayment.refunds?.map((refund) => {
            return {
              order_id: orderPaymentCollection.order.id,
              amount: MathBN.mult(
                input.amount ?? refund.raw_amount ?? refund.amount,
                -1
              ),
              currency_code: refundPayment.currency_code ?? order.currency_code,
              reference_id: refund.id,
              reference: "refund",
            }
          })
        }
      )

      addOrderTransactionStep(orderTransactionData)
    })

    when({ creditLineAmount }, ({ creditLineAmount }) =>
      MathBN.gt(creditLineAmount, 0)
    ).then(() => {
      createOrderRefundCreditLinesWorkflow.runAsStep({
        input: {
          order_id: order.id,
          amount: creditLineAmount,
          reference: refundReason?.label,
          referenceId: refundReason?.code,
        },
      })
    })

    emitEventStep({
      eventName: PaymentEvents.REFUNDED,
      data: { id: payment.id },
    })

    return new WorkflowResponse(payment)
  }
)
