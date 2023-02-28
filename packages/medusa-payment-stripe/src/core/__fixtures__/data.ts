import {
  EXISTING_CUSTOMER_EMAIL,
  FAIL_INTENT_ID,
  PARTIALLY_FAIL_INTENT_ID,
  WRONG_CUSTOMER_EMAIL,
} from "../../__mocks__/stripe"
import { PaymentIntentDataByStatus } from "../../__fixtures__/data"

// INITIATE PAYMENT DATA

export const initiatePaymentContextWithExistingCustomer = {
  email: EXISTING_CUSTOMER_EMAIL,
  currency_code: "usd",
  amount: 1000,
  resource_id: "test",
  customer: {},
  context: {},
  paymentSessionData: {},
}

export const initiatePaymentContextWithExistingCustomerStripeId = {
  email: EXISTING_CUSTOMER_EMAIL,
  currency_code: "usd",
  amount: 1000,
  resource_id: "test",
  customer: {
    metadata: {
      stripe_id: "test",
    },
  },
  context: {},
  paymentSessionData: {},
}

export const initiatePaymentContextWithWrongEmail = {
  email: WRONG_CUSTOMER_EMAIL,
  currency_code: "usd",
  amount: 1000,
  resource_id: "test",
  customer: {},
  context: {},
  paymentSessionData: {},
}

export const initiatePaymentContextWithFailIntentCreation = {
  email: EXISTING_CUSTOMER_EMAIL,
  currency_code: "usd",
  amount: 1000,
  resource_id: "test",
  customer: {},
  context: {
    payment_description: "fail",
  },
  paymentSessionData: {},
}

// AUTHORIZE PAYMENT DATA

export const authorizePaymentSuccessData = {
  id: PaymentIntentDataByStatus.SUCCEEDED.id,
}

// CANCEL PAYMENT DATA

export const cancelPaymentSuccessData = {
  id: PaymentIntentDataByStatus.SUCCEEDED.id,
}

export const cancelPaymentFailData = {
  id: FAIL_INTENT_ID,
}

export const cancelPaymentPartiallyFailData = {
  id: PARTIALLY_FAIL_INTENT_ID,
}

// CAPTURE PAYMENT DATA

export const capturePaymentContextSuccessData = {
  paymentSessionData: {
    id: PaymentIntentDataByStatus.SUCCEEDED.id,
  },
}

export const capturePaymentContextFailData = {
  paymentSessionData: {
    id: FAIL_INTENT_ID,
  },
}

export const capturePaymentContextPartiallyFailData = {
  paymentSessionData: {
    id: PARTIALLY_FAIL_INTENT_ID,
  },
}

// DELETE PAYMENT DATA

export const deletePaymentSuccessData = {
  id: PaymentIntentDataByStatus.SUCCEEDED.id,
}

export const deletePaymentFailData = {
  id: FAIL_INTENT_ID,
}

export const deletePaymentPartiallyFailData = {
  id: PARTIALLY_FAIL_INTENT_ID,
}

// REFUND PAYMENT DATA

export const refundPaymentSuccessData = {
  id: PaymentIntentDataByStatus.SUCCEEDED.id,
}

export const refundPaymentFailData = {
  id: FAIL_INTENT_ID,
}

// RETRIEVE PAYMENT DATA

export const retrievePaymentSuccessData = {
  id: PaymentIntentDataByStatus.SUCCEEDED.id,
}

export const retrievePaymentFailData = {
  id: FAIL_INTENT_ID,
}

// UPDATE PAYMENT DATA

export const updatePaymentContextWithExistingCustomer = {
  email: EXISTING_CUSTOMER_EMAIL,
  currency_code: "usd",
  amount: 1000,
  resource_id: "test",
  customer: {},
  context: {},
  paymentSessionData: {
    customer: "test",
    amount: 1000,
  },
}

export const updatePaymentContextWithExistingCustomerStripeId = {
  email: EXISTING_CUSTOMER_EMAIL,
  currency_code: "usd",
  amount: 1000,
  resource_id: "test",
  customer: {
    metadata: {
      stripe_id: "test",
    },
  },
  context: {},
  paymentSessionData: {
    customer: "test",
    amount: 1000,
  },
}

export const updatePaymentContextWithWrongEmail = {
  email: WRONG_CUSTOMER_EMAIL,
  currency_code: "usd",
  amount: 1000,
  resource_id: "test",
  customer: {},
  context: {},
  paymentSessionData: {
    customer: "test",
    amount: 1000,
  },
}

export const updatePaymentContextWithDifferentAmount = {
  email: WRONG_CUSTOMER_EMAIL,
  currency_code: "usd",
  amount: 2000,
  resource_id: "test",
  customer: {
    metadata: {
      stripe_id: "test",
    },
  },
  context: {},
  paymentSessionData: {
    id: PaymentIntentDataByStatus.SUCCEEDED.id,
    customer: "test",
    amount: 1000,
  },
}

export const updatePaymentContextFailWithDifferentAmount = {
  email: WRONG_CUSTOMER_EMAIL,
  currency_code: "usd",
  amount: 2000,
  resource_id: "test",
  customer: {
    metadata: {
      stripe_id: "test",
    },
  },
  context: {
    metadata: {
      stripe_id: "test",
    },
  },
  paymentSessionData: {
    id: FAIL_INTENT_ID,
    customer: "test",
    amount: 1000,
  },
}
