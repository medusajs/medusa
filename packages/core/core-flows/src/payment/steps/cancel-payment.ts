import { IPaymentModuleService, Logger } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  promiseAll,
} from "@medusajs/utils"
import { createStep } from "@medusajs/workflows-sdk"

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
      ModuleRegistrationName.PAYMENT
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
