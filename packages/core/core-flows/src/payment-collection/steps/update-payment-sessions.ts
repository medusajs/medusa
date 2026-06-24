import {
  BigNumberInput,
  IPaymentModuleService,
  Logger,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
  PaymentSessionStatus,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The data to update payment sessions in place.
 */
export interface UpdatePaymentSessionsStepInput {
  /**
   * The IDs of the payment sessions to update. Every id must resolve to an
   * existing, unconfirmed (`pending` / `requires_more`) session; the step fails
   * otherwise.
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
 * here. The step validates that every requested session exists and is
 * unconfirmed before performing any update, and fails otherwise — so a missing
 * or confirmed session never leaves the set partially updated. On compensation
 * the amounts are reverted.
 *
 * Callers that need to guard against a session being deleted concurrently (e.g.
 * a parallel refresh or re-init) should serialise those operations with a lock.
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
    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    if (!ids?.length) {
      return new StepResponse([], [])
    }

    const sessions = await service.listPaymentSessions(
      { id: ids },
      { select: ["id", "amount", "currency_code", "status", "data"] }
    )
    const sessionsById = new Map(sessions.map((s) => [s.id, s]))

    // Validate the whole set BEFORE mutating anything: a step that throws gets
    // no compensation callback, so a mid-loop failure would otherwise leave the
    // earlier sessions updated with no revert. Every requested session must
    // exist and be unconfirmed — a confirmed session's amount can't be changed
    // (the provider would reject it).
    for (const id of ids) {
      const session = sessionsById.get(id)

      if (!session) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Payment session ${id} was not found`
        )
      }

      if (
        session.status !== PaymentSessionStatus.PENDING &&
        session.status !== PaymentSessionStatus.REQUIRES_MORE
      ) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Payment session ${id} is ${session.status} and cannot be updated in place`
        )
      }
    }

    // Captured for compensation: the amount we updated FROM, plus the POST-update
    // provider data. Reverting must pass the post-update data (new amount) with
    // the old amount so a provider no-op guard (data amount === target) sees a
    // delta and actually resets the provider payment.
    const reverts: RevertData[] = []

    for (const id of ids) {
      const session = sessionsById.get(id)!

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
        amount: session.amount,
        currency_code: session.currency_code,
        data: updated.data,
      })
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

    // Best-effort revert of the in-place amount updates so the provider payments
    // are reset to their previous amounts.
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
