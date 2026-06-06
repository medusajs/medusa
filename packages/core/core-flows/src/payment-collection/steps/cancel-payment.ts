import type { IPaymentModuleService, Logger } from "@zjedene-medusa/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  promiseAll,
} from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to cancel payments.
 */
export interface CancelPaymentStepInput {
  /**
   * The IDs of the payments to cancel.
   */
  ids: string[]
}

export const cancelPaymentStepId = "cancel-payment"
/**
 * This step cancels one or more authorized payments.
 */
export const cancelPaymentStep = createStep(
  cancelPaymentStepId,
  async (input: CancelPaymentStepInput, { container }) => {
    const { ids = [] } = input
    const deleted: string[] = []
    const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    if (!ids?.length) {
      return new StepResponse([], null)
    }

    const promises: Promise<void>[] = []

    for (const id of ids) {
      const promise = service
        .cancelPayment(id)
        .then((res) => {
          deleted.push(id)
        })
        .catch((e) => {
          logger.error(
            `Encountered an error when trying to cancel a payment - ${id} - ${e}`
          )
        })

      promises.push(promise)
    }

    await promiseAll(promises)

    return new StepResponse(deleted)
  }
)
