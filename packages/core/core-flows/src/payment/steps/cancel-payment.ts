import type { IPaymentModuleService, Logger } from "@zjedene-medusa/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  promiseAll,
} from "@zjedene-medusa/framework/utils"
import { createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to cancel one or more payments.
 */
export type CancelPaymentStepInput = {
  /**
   * The ID(s) of the payment(s) to cancel.
   */
  paymentIds: string | string[]
}

export const cancelPaymentStepId = "cancel-payment-step"
/**
 * This step cancels one or more payments.
 */
export const cancelPaymentStep = createStep(
  cancelPaymentStepId,
  async (input: CancelPaymentStepInput, { container }) => {
    const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
    const paymentModule = container.resolve<IPaymentModuleService>(
      Modules.PAYMENT
    )

    const paymentIds = Array.isArray(input.paymentIds)
      ? input.paymentIds
      : [input.paymentIds]

    const promises: Promise<any>[] = []

    for (const id of paymentIds) {
      promises.push(
        paymentModule.cancelPayment(id).catch((e) => {
          logger.error(
            `Error was thrown trying to cancel payment - ${id} - ${e}`
          )
        })
      )
    }

    await promiseAll(promises)
  }
)
