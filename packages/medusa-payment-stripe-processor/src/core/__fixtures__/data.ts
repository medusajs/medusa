import {
  EXISTING_CUSTOMER_EMAIL,
  WRONG_CUSTOMER_EMAIL
} from "../../__mocks__/stripe";

export const initiatePaymentContextWithExistingCustomer = {
  email: EXISTING_CUSTOMER_EMAIL,
  currency_code: "usd",
  amount: 1000,
  resource_id: "test",
  customer: {},
  context: {},
  paymentSessionData: {}
}

export const initiatePaymentContextWithExistingCustomerStripeId = {
  email: EXISTING_CUSTOMER_EMAIL,
  currency_code: "usd",
  amount: 1000,
  resource_id: "test",
  customer: {
    metadata: {
      stripe_id: "test"
    }
  },
  context: {},
  paymentSessionData: {}
}

export const initiatePaymentContextWithWrongEmail = {
  email: WRONG_CUSTOMER_EMAIL,
  currency_code: "usd",
  amount: 1000,
  resource_id: "test",
  customer: {},
  context: {},
  paymentSessionData: {}
}

export const initiatePaymentContextWithFailIntentCreation = {
  email: EXISTING_CUSTOMER_EMAIL,
  currency_code: "usd",
  amount: 1000,
  resource_id: "test",
  customer: {},
  context: {
    description: "fail"
  },
  paymentSessionData: {}
}
