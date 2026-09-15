import type { CartWorkflowDTO } from "@medusajs/framework/types"
import {
  BigNumber,
  defaultCurrencies,
  getEpsilonFromDecimalPrecision,
  isDefined,
  MathBN,
  MedusaError,
  PaymentSessionStatus,
} from "@medusajs/framework/utils"

export interface ValidateCartPaymentAmountInput {
  cart: CartWorkflowDTO
}

const processablePaymentStatuses = [
  PaymentSessionStatus.PENDING,
  PaymentSessionStatus.REQUIRES_MORE,
  PaymentSessionStatus.AUTHORIZED,
  PaymentSessionStatus.CAPTURED,
  PaymentSessionStatus.PENDING_AUTHORIZATION,
]

const isFiniteAmount = (value: unknown): boolean => {
  if (!isDefined(value) || value === null) {
    return false
  }

  return MathBN.convert(value as any).isFinite()
}

export const validateCartPaymentAmount = ({
  cart,
}: ValidateCartPaymentAmountInput): void => {
  if (cart.completed_at) {
    return
  }

  const canSkipPayment =
    MathBN.convert(cart.credit_line_total ?? 0).gte(0) &&
    MathBN.convert(cart.total ?? 0).lte(0)

  if (canSkipPayment) {
    return
  }

  if (!isFiniteAmount(cart.total)) {
    return
  }

  const paymentsToProcess =
    cart.payment_collection?.payment_sessions?.filter((ps) =>
      processablePaymentStatuses.includes(ps.status as PaymentSessionStatus)
    ) ?? []

  if (!paymentsToProcess.length) {
    return
  }

  const epsilon = getEpsilonFromDecimalPrecision(
    defaultCurrencies[cart.currency_code?.toUpperCase() as string]
      ?.decimal_digits
  )

  for (const session of paymentsToProcess) {
    if (!isFiniteAmount(session.amount)) {
      continue
    }

    const difference = MathBN.sub(session.amount, cart.total)

    if (MathBN.lte(MathBN.abs(difference), epsilon)) {
      continue
    }

    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Payment session ${session.id} has an amount of ${
        new BigNumber(session.amount).numeric
      }, but the cart's total is ${
        new BigNumber(cart.total).numeric
      }. Refresh the cart's payment collection so that the payment session's amount matches the cart's total.`
    )
  }
}
