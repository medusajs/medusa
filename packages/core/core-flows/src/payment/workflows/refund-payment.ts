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
  /**
   * A caller-supplied key that makes the refund idempotent at the payment
   * provider. Retrying the workflow with the same key never moves funds twice,
   * even when the response of the original request was lost.
   */
  idempotency_key?: string
}

/**
 * This step validates that the refund amount does not exceed the captured amount for a payment.
 * The validation accounts for currency decimal precision to handle rounding issues.
 *
 * @example
 * validateRefundPaymentExceedsCapturedAmountStep({
 *   payment: paymentData,
 *   refundAmount: 100.50
 * })
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
 * [Refund Payment Admin API Route](https://docs.medusajs.com/api/admin/payments/refund-payment).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to refund a payment in your custom flows.
 *
 * The workflow returns the **payment**, not the refund it created, and the payment is
 * retrieved before the refund is issued. So its `refunds` property doesn't include the
 * new refund. To get the refund itself, retrieve the payment again after the workflow
 * resolves, or use the Payment Module's `refundPayment` method instead.
 *
 * Pass an `idempotency_key` if the refund may be retried, such as when it's issued by a
 * background job or a return flow. The key is forwarded to the payment provider, so
 * retrying with the same key never refunds twice, even when the response of the original
 * request was lost. Without a key every run starts a new refund, so a retry whose first
 * attempt may have gone through can refund twice: only the key tells the provider that
 * the second request is the same request.
 *
 * @example
 * const { result } = await refundPaymentWorkflow(container)
 * .run({
 *   input: {
 *     payment_id: "payment_123",
 *     idempotency_key: "return_123_refund",
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

    // A replay of an already-succeeded refund moves no funds, so the credit line
    // and the event below must not run a second time. The module de-duplicates
    // the provider call but has no way to tell the workflow it did, so the
    // replay is detected here instead.
    const existingRefund = when(
      "fetch-refund-by-idempotency-key",
      { input },
      ({ input }) => !!input.idempotency_key
    ).then(() => {
      return useRemoteQueryStep({
        entry_point: "refund",
        fields: ["id"],
        variables: {
          filters: {
            payment_id: input.payment_id,
            idempotency_key: input.idempotency_key,
          },
        },
        list: true,
      }).config({ name: "refund-by-idempotency-key" })
    })

    const refundTransactions = when(
      "fetch-refund-order-transaction",
      { existingRefund },
      ({ existingRefund }) => !!existingRefund?.length
    ).then(() => {
      const refundIds = transform(
        { existingRefund },
        ({ existingRefund }) => existingRefund.map((refund) => refund.id)
      )

      return useRemoteQueryStep({
        entry_point: "order_transaction",
        fields: ["id"],
        variables: {
          filters: { reference: "refund", reference_id: refundIds },
        },
        list: true,
      }).config({ name: "order-transaction-by-refund" })
    })

    const isReplay = transform(
      { refundTransactions },
      ({ refundTransactions }) => !!refundTransactions?.length
    )

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

    // Always run, replay or not: the step skips transactions it already wrote,
    // so a retry after a half-finished attempt still records the refund.
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

    when({ creditLineAmount, isReplay }, ({ creditLineAmount, isReplay }) =>
      !isReplay && MathBN.gt(creditLineAmount, 0)
    ).then(() => {
      const createRefundCreditLinesData = transform({
        order, creditLineAmount, refundReason,
      }, (data) => {
        return {
          order_id: data.order.id,
          amount: data.creditLineAmount,
          reference: data.refundReason?.label,
          referenceId: data.refundReason?.code,
        }
      })
      createOrderRefundCreditLinesWorkflow.runAsStep({
        input: createRefundCreditLinesData,
      })
    })

    when({ isReplay }, ({ isReplay }) => !isReplay).then(() => {
      emitEventStep({
        eventName: PaymentEvents.REFUNDED,
        data: { id: payment.id },
      })
    })

    return new WorkflowResponse(payment)
  }
)
