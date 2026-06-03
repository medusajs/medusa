import {
  BigNumberInput,
  IPaymentModuleService,
  Logger,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  PaymentSessionStatus,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The data to update payment sessions in place.
 */
export interface UpdatePaymentSessionsStepInput {
  /**
   * The IDs of the payment sessions to update. The caller is expected to only
   * pass unconfirmed (`pending` / `requires_more`) sessions; confirmed sessions
   * are skipped defensively.
   */
  ids: string[]
  /**
   * The new amount to set on the payment sessions.
   */
  amount: BigNumberInput
  /**
   * The currency code of the payment sessions.
   *
   * @example
   * usd
   */
  currency_code: string
}

type RevertData = {
  id: string
  amount: BigNumberInput
  currency_code: string
  data: Record<string, unknown>
}

export const updatePaymentSessionsStepId = "update-payment-sessions"
/**
 * This step updates the amount of one or more payment sessions in place.
 *
 * Updating a session in place keeps its underlying provider payment (e.g. the
 * same Stripe PaymentIntent) instead of deleting and recreating it, which avoids
 * creating a new provider payment every time a cart's total changes during
 * checkout.
 *
 * Only unconfirmed sessions (`pending` / `requires_more`) can have their amount
 * changed, so the caller is expected to filter the sessions before passing them
 * here; any other session that slips through is skipped. If a provider update
 * fails (for example the provider payment no longer exists), the session is
 * deleted as a best-effort fallback so the caller can recreate it, rather than
 * failing the whole operation.
 *
 * Note: This step should not be used alone as it doesn't consider a revert
 * Use {@link updatePaymentSessionsWorkflow} or compose it within a workflow that
 * handles recreation of deleted sessions.
 *
 * @example
 * const data = updatePaymentSessionsStep({
 *   ids: ["payses_123"],
 *   amount: 3000,
 *   currency_code: "usd",
 * })
 */
export const updatePaymentSessionsStep = createStep(
  updatePaymentSessionsStepId,
  async (input: UpdatePaymentSessionsStepInput, { container }) => {
    const { ids = [], amount, currency_code } = input
    const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    if (!ids?.length) {
      return new StepResponse([], [])
    }

    const sessions = await service.listPaymentSessions(
      { id: ids },
      { select: ["id", "amount", "currency_code", "status", "data"] }
    )

    // Captured for compensation: the amount we updated FROM, plus the POST-update
    // provider data. Reverting must pass the post-update data (new amount) with
    // the old amount so a provider no-op guard (data amount === target) sees a
    // delta and actually resets the provider payment.
    const reverts: RevertData[] = []

    for (const session of sessions) {
      // Defensive: the caller only routes unconfirmed sessions here, but never
      // change a confirmed session's amount even if a stale id slips through —
      // the provider would reject it.
      if (
        session.status !== PaymentSessionStatus.PENDING &&
        session.status !== PaymentSessionStatus.REQUIRES_MORE
      ) {
        continue
      }

      const previousAmount = session.amount
      const previousCurrency = session.currency_code

      try {
        const updated = await service.updatePaymentSession({
          id: session.id,
          amount,
          currency_code,
          // Pass the existing session's data so the provider targets the same
          // underlying payment (e.g. the same Stripe PaymentIntent) instead of
          // creating a new one.
          data: session.data,
        })

        reverts.push({
          id: session.id,
          amount: previousAmount,
          currency_code: previousCurrency,
          data: updated.data,
        })
      } catch (e) {
        // The in-place update failed (e.g. the provider payment no longer
        // exists). Fall back to the original behaviour for this session: delete
        // it so the caller can recreate a fresh session. Best-effort and
        // swallowed, mirroring deletePaymentSessionsStep, so a single stale
        // session can't fail the whole operation.
        logger.warn(
          `In-place payment session update failed for ${session.id}; deleting it so it can be recreated - ${e}`
        )

        try {
          await service.deletePaymentSession(session.id)
        } catch (deleteError) {
          logger.error(
            `Failed to delete payment session ${session.id} after a failed in-place update - ${deleteError}`
          )
        }
      }
    }

    return new StepResponse(
      reverts.map((r) => r.id),
      reverts
    )
  },
  async (reverts, { container }) => {
    if (!reverts?.length) {
      return
    }

    const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    // Best-effort revert of the in-place amount updates (mirrors
    // deletePaymentSessionsStep's "we accept a level of risk" recreate
    // compensation).
    for (const revert of reverts) {
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
  }
)
