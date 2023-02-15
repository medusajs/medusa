import { PaymentIntentDataByStatus } from "../__fixtures__/data"

export const WRONG_CUSTOMER_EMAIL = "wrong@test.fr"
export const EXISTING_CUSTOMER_EMAIL = "right@test.fr"
export const NON_EXISTING_CUSTOMER_EMAIL = "right@test.fr"
export const STRIPE_ID = "test"

function buildPaymentIntent(data) {
  const paymentIntentData = {}

  return Object.assign(paymentIntentData, data)
}

export const StripeMock = {
  paymentIntents: {
    retrieve: jest.fn().mockImplementation(async (paymentId) => {
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
    })
  },
  customers: {
    create: jest.fn().mockImplementation(async data => {
      if (data.email === EXISTING_CUSTOMER_EMAIL) {
        return { id: STRIPE_ID, ...data }
      }

      throw new Error("Error")
    })
  },
}

const stripe = jest.fn(() => StripeMock)

export default stripe
