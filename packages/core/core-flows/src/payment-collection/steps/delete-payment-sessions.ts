import {
  IPaymentModuleService,
  Logger,
  PaymentSessionDTO,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  promiseAll,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export interface DeletePaymentSessionStepInput {
  ids: string[]
}

export const deletePaymentSessionsStepId = "delete-payment-sessions"
/**
 * This step deletes one or more payment sessions.
 *
 * Note: This step should not be used alone as it doesn't consider a revert
 * Use deletePaymentSessionsWorkflow instead that uses this step
 */
export const deletePaymentSessionsStep = createStep(
  deletePaymentSessionsStepId,
  async (input: DeletePaymentSessionStepInput, { container }) => {
    const { ids = [] } = input
    const deleted: PaymentSessionDTO[] = []
    const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    if (!ids?.length) {
      return new StepResponse([], null)
    }

    const select = [
      "provider_id",
      "currency_code",
      "amount",
      "data",
      "context",
      "payment_collection.id",
    ]

    const sessions = await service.listPaymentSessions({ id: ids }, { select })
    const sessionMap = new Map(sessions.map((s) => [s.id, s]))

    const promises: Promise<void>[] = []

    for (const id of ids) {
      const session = sessionMap.get(id)!

      // As this requires an external method call, we will try to delete as many successful calls
      // as possible and pass them over to the compensation step to be recreated if any of the
      // payment sessions fails to delete.
      const promise = service
        .deletePaymentSession(id)
        .then((res) => {
          deleted.push(session)
        })
        .catch((e) => {
          logger.error(
            `Encountered an error when trying to delete payment session - ${id} - ${e}`
          )
        })

      promises.push(promise)
    }

    await promiseAll(promises)

    return new StepResponse(
      deleted.map((d) => d.id),
      deleted
    )
  },
  async (deletedPaymentSessions, { container }) => {
    const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    if (!deletedPaymentSessions?.length) {
      return
    }

    for (const paymentSession of deletedPaymentSessions) {
      if (!paymentSession.payment_collection?.id) {
        continue
      }

      const payload = {
        provider_id: paymentSession.provider_id,
        currency_code: paymentSession.currency_code,
        amount: paymentSession.amount,
        data: paymentSession.data ?? {},
        context: paymentSession.context,
      }

      // Creating a payment session also requires an external call. If we fail to recreate the
      // payment step, we would have to compensate successfully even though it didn't recreate
      // all the necessary sessions. We accept a level of risk here for the payment collection to
      // be set in an incomplete state.
      try {
        await service.createPaymentSession(
          paymentSession.payment_collection?.id,
          payload
        )
      } catch (e) {
        logger.error(
          `Encountered an error when trying to recreate a payment session - ${payload} - ${e}`
        )
      }
    }
  }
)
