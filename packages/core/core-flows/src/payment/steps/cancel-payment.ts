import { IPaymentModuleService, Logger } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  promiseAll,
} from "@medusajs/framework/utils"
import { createStep } from "@medusajs/framework/workflows-sdk"

export type CancelPaymentStepInput = {
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
