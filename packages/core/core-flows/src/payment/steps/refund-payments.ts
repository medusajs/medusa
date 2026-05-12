import {
  BigNumberInput,
  IPaymentModuleService,
  Logger,
  PaymentDTO,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  isObject,
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

export const refundPaymentsStepId = "refund-payments-step"
/**
 * This step refunds one or more payments.
 */
export const refundPaymentsStep = createStep(
  refundPaymentsStepId,
  async (input: RefundPaymentsStepInput, { container }) => {
    const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
    const paymentModule = container.resolve<IPaymentModuleService>(
      Modules.PAYMENT
    )

    const promises: Promise<PaymentDTO | void>[] = []

    for (const refundInput of input) {
      promises.push(
        paymentModule.refundPayment(refundInput).catch((e) => {
          logger.error(
            `Error was thrown trying to cancel payment - ${refundInput.payment_id} - ${e}`
          )
        })
      )
    }

    const successfulRefunds = (await promiseAll(promises)).filter((payment) =>
      isObject(payment)
    )

    return new StepResponse(successfulRefunds)
  }
)
