import {
  BigNumberInput,
  IPaymentModuleService,
  Logger,
  PaymentSessionDTO,
} from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The data to update a single payment session in place.
 */
export interface UpdatePaymentSessionStepInput {
  /**
   * The ID of the payment session to update.
   */
  id: string
  /**
   * The new amount to set on the payment session.
   */
  amount: BigNumberInput
  /**
   * The currency code of the payment session.
   *
   * @example
   * usd
   */
  currency_code: string
}

/**
 * The result of attempting to update a payment session in place.
 */
export interface UpdatePaymentSessionStepOutput {
  /**
   * The updated payment session, or `null` if the in-place update failed and the
   * session was deleted as a fallback.
   */
  session: PaymentSessionDTO | null
  /**
   * Whether the session was updated in place. `false` means the in-place update
   * failed (e.g. the provider payment no longer exists) and the session was
   * deleted, so the caller should create a fresh session instead.
   */
  updated: boolean
}

type RevertData = {
  id: string
  amount: BigNumberInput
  currency_code: string
  data: Record<string, unknown>
}

export const updatePaymentSessionStepId = "update-payment-session"
/**
 * This step updates the amount of a single payment session in place.
 *
 * Updating a session in place keeps its underlying provider payment (e.g. the
 * same Stripe PaymentIntent and its client secret) instead of deleting and
 * recreating it, which avoids creating a new provider payment every time a
 * payment session is (re-)initialized for an unchanged provider/currency.
 *
 * The session's existing `data` is passed through so the provider targets the
 * same underlying payment rather than creating a new one. On compensation the
 * amount is reverted, so a downstream failure leaves the provider payment as it
 * was before this step ran.
 *
 * If the in-place update fails (for example the provider payment no longer
 * exists), the session is deleted as a best-effort fallback and `updated: false`
 * is returned — mirroring {@link updatePaymentSessionsStep} — so the caller can
 * create a fresh session instead of failing the whole operation.
 *
 * @example
 * const result = updatePaymentSessionStep({
 *   id: "payses_123",
 *   amount: 3000,
 *   currency_code: "usd",
 * })
 */
export const updatePaymentSessionStep = createStep(
  updatePaymentSessionStepId,
  async (input: UpdatePaymentSessionStepInput, { container }) => {
    const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    const session = await service.retrievePaymentSession(input.id, {
      select: ["id", "amount", "currency_code", "data"],
    })

    try {
      const updated = await service.updatePaymentSession({
        id: input.id,
        amount: input.amount,
        currency_code: input.currency_code,
        // Pass the existing session's data so the provider targets the same
        // underlying payment (e.g. the same Stripe PaymentIntent) instead of
        // creating a new one.
        data: session.data,
      })

      // Captured for compensation: the amount we updated FROM, plus the
      // POST-update provider data. Reverting must pass the post-update data
      // (new amount) with the old amount so a provider no-op guard (data amount
      // === target) sees a delta and actually resets the provider payment.
      return new StepResponse<UpdatePaymentSessionStepOutput, RevertData>(
        { session: updated, updated: true },
        {
          id: session.id,
          amount: session.amount,
          currency_code: session.currency_code,
          data: updated.data,
        }
      )
    } catch (e) {
      // The in-place update failed (e.g. the provider payment no longer exists).
      // Delete the stale session as a best-effort fallback so the caller can
      // create a fresh one, rather than failing the whole operation. Mirrors
      // updatePaymentSessionsStep. No revert data is returned: the session is
      // gone and its provider payment was already missing, so there is nothing
      // to restore on compensation.
      logger.warn(
        `In-place update of payment session ${input.id} failed; deleting it so a fresh session can be created - ${e}`
      )

      try {
        await service.deletePaymentSession(input.id)
      } catch (deleteError) {
        logger.error(
          `Failed to delete payment session ${input.id} after a failed in-place update - ${deleteError}`
        )
      }

      return new StepResponse<UpdatePaymentSessionStepOutput, RevertData>({
        session: null,
        updated: false,
      })
    }
  },
  async (revert: RevertData | undefined, { container }) => {
    if (!revert) {
      return
    }

    const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    // Best-effort revert of the in-place amount update so the provider payment
    // is reset to its previous amount, mirroring updatePaymentSessionsStep's
    // compensation.
    try {
      await service.updatePaymentSession({
        id: revert.id,
        amount: revert.amount,
        currency_code: revert.currency_code,
        data: revert.data,
      })
    } catch (e) {
      logger.error(
        `Failed to revert payment session ${revert.id} amount during compensation - ${e}`
      )
    }
  }
)
