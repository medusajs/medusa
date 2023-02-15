import {
  EXISTING_CUSTOMER_EMAIL,
  FAIL_INTENT_ID,
  PARTIALLY_FAIL_INTENT_ID,
  WRONG_CUSTOMER_EMAIL
} from "../../__mocks__/stripe";
import { PaymentIntentDataByStatus } from "../../__fixtures__/data";

// INITIATE PAYMENT DATA

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

// AUTHORIZE PAYMENT DATA

export const authorizePaymentSuccessData = {
  id: PaymentIntentDataByStatus.SUCCEEDED.id
}

// CANCEL PAYMENT DATA

export const cancelPaymentSuccessData = {
  id: PaymentIntentDataByStatus.SUCCEEDED.id
}

export const cancelPaymentFailData = {
  id: FAIL_INTENT_ID
}

export const cancelPaymentPartiallyFailData = {
  id: PARTIALLY_FAIL_INTENT_ID
}

// CAPTURE PAYMENT DATA

export const capturePaymentContextSuccessData = {
  paymentSessionData: {
    id: PaymentIntentDataByStatus.SUCCEEDED.id
  }
}

export const capturePaymentContextFailData = {
  paymentSessionData: {
    id: FAIL_INTENT_ID
  }
}

export const capturePaymentContextPartiallyFailData = {
  paymentSessionData: {
    id: PARTIALLY_FAIL_INTENT_ID
  }
}

// DELETE PAYMENT DATA

export const deletePaymentSuccessData = {
  id: PaymentIntentDataByStatus.SUCCEEDED.id
}

export const deletePaymentFailData = {
  id: FAIL_INTENT_ID
}

export const deletePaymentPartiallyFailData = {
  id: PARTIALLY_FAIL_INTENT_ID
}