import {
  IPaymentModuleService,
  Logger,
  PaymentSessionDTO,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  PaymentSessionStatus,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { CreatePaymentSessionStepInput } from "./create-payment-session"

/**
 * The data to create or reuse a payment session.
 */
export interface CreateOrUpdatePaymentSessionStepInput
  extends CreatePaymentSessionStepInput {
  /**
   * The payment collection's existing sessions, used to decide whether an
   * unconfirmed session can be reused (updated in place) instead of recreated.
   */
  existing_sessions?: PaymentSessionDTO[]
}

/**
 * The result of creating or reusing a payment session.
 */
export interface CreateOrUpdatePaymentSessionStepOutput {
  /**
   * The created or updated payment session.
   */
  session: PaymentSessionDTO
  /**
   * The ID of the session that was reused (updated in place), or `null` if a
   * new session was created. The caller uses this to exclude the reused session
   * from deletion.
   */
  reused_session_id: string | null
}

type CompensateData = {
  created_session_id: string | null
}

export const createOrUpdatePaymentSessionStepId =
  "create-or-update-payment-session"
/**
 * This step reuses an existing unconfirmed payment session by updating its
 * amount in place when possible, otherwise it creates a new payment session.
 *
 * Reusing a session keeps its underlying provider payment (e.g. the same Stripe
 * PaymentIntent and its client secret) instead of creating a new one every time
 * a payment session is (re-)initialized for a payment collection — for example
 * when a storefront re-initializes the session after the cart total changes.
 *
 * A session is reusable only when it belongs to the same provider, has the same
 * currency, and is unconfirmed (`pending` / `requires_more`). Otherwise — no
 * reusable session, a provider switch, a currency change, a confirmed session,
 * or a failed in-place update — a new session is created instead.
 *
 * @example
 * const data = createOrUpdatePaymentSessionStep({
 *   payment_collection_id: "paycol_123",
 *   provider_id: "pp_stripe_stripe",
 *   amount: 3000,
 *   currency_code: "usd",
 *   existing_sessions: paymentCollection.payment_sessions,
 * })
 */
export const createOrUpdatePaymentSessionStep = createStep(
  createOrUpdatePaymentSessionStepId,
  async (input: CreateOrUpdatePaymentSessionStepInput, { container }) => {
    const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    const existingSessions = input.existing_sessions ?? []

    // Reusable = an unconfirmed session for the SAME provider and currency. A
    // confirmed session's amount can't be changed, and a provider can't change a
    // session's currency, so those must be recreated. Currency is compared
    // case-insensitively to avoid silently falling through to a new session
    // (and a new provider payment) on a casing mismatch.
    const targetCurrency = (input.currency_code ?? "").toLowerCase()
    const reusable = existingSessions.find(
      (s) =>
        s.provider_id === input.provider_id &&
        (s.currency_code ?? "").toLowerCase() === targetCurrency &&
        (s.status === PaymentSessionStatus.PENDING ||
          s.status === PaymentSessionStatus.REQUIRES_MORE)
    )

    if (reusable) {
      try {
        const updated = await service.updatePaymentSession({
          id: reusable.id,
          amount: input.amount,
          currency_code: input.currency_code,
          // The existing session's data carries the provider payment id, so the
          // update targets the same underlying payment (keeping its client
          // secret) instead of creating a new one.
          data: reusable.data,
        })

        return new StepResponse<
          CreateOrUpdatePaymentSessionStepOutput,
          CompensateData
        >(
          { session: updated, reused_session_id: reusable.id },
          { created_session_id: null }
        )
      } catch (e) {
        // In-place reuse failed (e.g. the provider payment no longer exists).
        // Fall through to creating a fresh session; the stale session is left
        // for the caller's delete step (reused_session_id stays null).
        logger.warn(
          `In-place reuse of payment session ${reusable.id} failed; creating a new session instead - ${e}`
        )
      }
    }

    const created = await service.createPaymentSession(
      input.payment_collection_id,
      {
        provider_id: input.provider_id,
        currency_code: input.currency_code,
        amount: input.amount,
        data: input.data ?? {},
        context: input.context,
        metadata: input.metadata ?? {},
      }
    )

    return new StepResponse<
      CreateOrUpdatePaymentSessionStepOutput,
      CompensateData
    >(
      { session: created, reused_session_id: null },
      { created_session_id: created.id }
    )
  },
  async (compensateData: CompensateData | undefined, { container }) => {
    // Mirror createPaymentSessionStep: only a newly-created session is rolled
    // back. A reused/updated session is reverted by its own delete workflow.
    if (!compensateData?.created_session_id) {
      return
    }

    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    await service.deletePaymentSession(compensateData.created_session_id)
  }
)
