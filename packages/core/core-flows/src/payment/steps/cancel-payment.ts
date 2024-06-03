import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPaymentModuleService, Logger } from "@medusajs/types"
import { ContainerRegistrationKeys, promiseAll } from "@medusajs/utils"
import { createStep } from "@medusajs/workflows-sdk"

type StepInput = {
  payment_ids: string | string[]
}

export const cancelPaymentStepId = "cancel-payment-step"
export const cancelPaymentStep = createStep(
  cancelPaymentStepId,
  async (input: StepInput, { container }) => {
    const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
    const paymentModule = container.resolve<IPaymentModuleService>(
      ModuleRegistrationName.PAYMENT
    )

    const payment_ids = Array.isArray(input.payment_ids)
      ? input.payment_ids
      : [input.payment_ids]

    const promises: Promise<any>[] = []
    for (const payment_id of payment_ids) {
      promises.push(
        paymentModule.cancelPayment(payment_id).catch((e) => {
          logger.error(
            `Error was thrown trying to cancel payment - ${payment_id} - ${e}`
          )
        })
      )
    }
    await promiseAll(promises)
  }
)
