import { IPaymentModuleService, Logger, PaymentDTO } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  ModuleRegistrationName,
  PaymentSessionStatus,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type StepInput = {
  id: string
  context: Record<string, unknown>
}

export const authorizePaymentSessionStepId = "authorize-payment-session-step"
export const authorizePaymentSessionStep = createStep(
  authorizePaymentSessionStepId,
  async (input: StepInput, { container }) => {
    let payment: PaymentDTO | undefined
    const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
    const paymentModule = container.resolve<IPaymentModuleService>(
      ModuleRegistrationName.PAYMENT
    )

    try {
      payment = await paymentModule.authorizePaymentSession(
        input.id,
        input.context || {}
      )
    } catch (e) {
      logger.error(
        `Error was thrown trying to authorize payment session - ${input.id} - ${e}`
      )
    }

    const paymentSession = await paymentModule.retrievePaymentSession(input.id)

    // Throw a special error type when the status is requires_more as it requires a specific further action
    // from the consumer
    if (paymentSession.status === PaymentSessionStatus.REQUIRES_MORE) {
      throw new MedusaError(
        MedusaError.Types.PAYMENT_REQUIRES_MORE_ERROR,
        `More information is required for payment`
      )
    }

    // If any other error other than requires_more shows up, this usually requires the consumer to create a new payment session
    // This could also be a system error thats caused by invalid setup or a failure in connecting to external providers
    if (paymentSession.status !== PaymentSessionStatus.AUTHORIZED || !payment) {
      throw new MedusaError(
        MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
        `Payment authorization failed`
      )
    }

    return new StepResponse(payment)
  },
  // If payment or any other part of complete cart fails post payment step, we cancel any payments made
  async (payment, { container }) => {
    if (!payment) {
      return
    }

    const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
    const paymentModule = container.resolve<IPaymentModuleService>(
      ModuleRegistrationName.PAYMENT
    )

    // If the payment session status is requires_more, we don't have to revert the payment.
    // Return the same status for the cart completion to be re-run.
    if (
      payment.payment_session &&
      payment.payment_session.status === PaymentSessionStatus.REQUIRES_MORE
    ) {
      return
    }

    try {
      await paymentModule.cancelPayment(payment.id)
    } catch (e) {
      logger.error(
        `Error was thrown trying to cancel payment - ${payment.id} - ${e}`
      )
    }
  }
)
