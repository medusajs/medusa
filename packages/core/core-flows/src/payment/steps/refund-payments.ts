import {
  BigNumberInput,
  IPaymentModuleService,
  PaymentDTO,
} from "@medusajs/framework/types"
import {
  Modules,
  promiseAll,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The data to refund one or more payments.
 */
export type RefundPaymentsStepInput = {
  /**
   * The ID of the payment to refund.
   */
  payment_id: string
  /**
   * The amount to refund.
   */
  amount: BigNumberInput
  /**
   * The ID of the user that refunded the payment.
   */
  created_by?: string
  /**
   * The note to attach to the refund.
   */
  note?: string
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>
}[]

type RefundPaymentsStepOutput = {
  refunded_payments: PaymentDTO[]
  failed_refunds: {
    payment_id: string
    amount: BigNumberInput
    error: string
  }[]
}

export const refundPaymentsStepId = "refund-payments-step"
/**
 * This step refunds one or more payments.
 */
export const refundPaymentsStep = createStep(
  refundPaymentsStepId,
  async (input: RefundPaymentsStepInput, { container }) => {
    const paymentModule = container.resolve<IPaymentModuleService>(
      Modules.PAYMENT
    )

    const promises: Promise<
      | { refunded_payment: PaymentDTO; failed_refund?: never }
      | {
          refunded_payment?: never
          failed_refund: {
            payment_id: string
            amount: BigNumberInput
            error: string
          }
        }
    >[] = []

    for (const refundInput of input) {
      promises.push(
        paymentModule
          .refundPayment(refundInput)
          .then((refundedPayment) => ({ refunded_payment: refundedPayment }))
          .catch((error: unknown) => ({
            failed_refund: {
              payment_id: refundInput.payment_id,
              amount: refundInput.amount,
              error: error instanceof Error ? error.message : String(error),
            },
          }))
      )
    }

    const results = await promiseAll(promises)

    const output: RefundPaymentsStepOutput = {
      refunded_payments: [],
      failed_refunds: [],
    }

    for (const result of results) {
      if (result.refunded_payment) {
        output.refunded_payments.push(result.refunded_payment)
        continue
      }

      output.failed_refunds.push(result.failed_refund)
    }

    return new StepResponse(output)
  }
)
