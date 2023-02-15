import { PaymentIntentDataByStatus } from "../__fixtures__/data"
import Stripe from "stripe";
import { ErrorCodes, ErrorIntentStatus } from "../types";

export const WRONG_CUSTOMER_EMAIL = "wrong@test.fr"
export const EXISTING_CUSTOMER_EMAIL = "right@test.fr"
export const STRIPE_ID = "test"
export const PARTIALLY_FAIL_INTENT_ID = "partially_unknown"
export const FAIL_INTENT_ID = "unknown"

function buildPaymentIntent(data) {
  const paymentIntentData = {}

  return Object.assign(paymentIntentData, data)
}

export const StripeMock = {
  paymentIntents: {
    retrieve: jest.fn().mockImplementation(async (paymentId) => {
      if (paymentId === FAIL_INTENT_ID) {
        throw new Error("Error")
      }

      const data = Object.values(PaymentIntentDataByStatus).find(value => {
        return value.id === paymentId
      }) ?? {}

      return buildPaymentIntent(data)
    }),
    create: jest.fn().mockImplementation(async (data) => {
      if (data.description === "fail") {
        throw new Error("Error")
      }

      return data
    }),
    cancel: jest.fn().mockImplementation(async (paymentId) => {
      if (paymentId === FAIL_INTENT_ID) {
        throw new Error("Error")
      }

      if (paymentId === PARTIALLY_FAIL_INTENT_ID) {
        throw new Stripe.errors.StripeError({
          code: ErrorCodes.PAYMENT_INTENT_UNEXPECTED_STATE,
          payment_intent: {
            id: paymentId,
            status: ErrorIntentStatus.CANCELED
          } as unknown as Stripe.PaymentIntent,
          type: "invalid_request_error"
        })
      }

      return { id: paymentId }
    })
  },
  customers: {
    create: jest.fn().mockImplementation(async (data) => {
      if (data.email === EXISTING_CUSTOMER_EMAIL) {
        return { id: STRIPE_ID, ...data }
      }

      throw new Error("Error")
    })
  },
}

const stripe = jest.fn(() => StripeMock)

export default stripe
