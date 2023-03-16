import {
  FAIL_INTENT_ID,
  SUCCESS_INTENT,
} from "../../__mocks__/@paypal/checkout-server-sdk"
import { PaymentIntentDataByStatus } from "../../__fixtures__/data"

// INITIATE PAYMENT DATA

export const initiatePaymentContextSuccess = {
  currency_code: "usd",
  amount: 1000,
  resource_id: SUCCESS_INTENT,
  customer: {},
  context: {},
  paymentSessionData: {},
}

export const initiatePaymentContextFail = {
  currency_code: "usd",
  amount: 1000,
  resource_id: FAIL_INTENT_ID,
  customer: {
    metadata: {
      stripe_id: "test",
    },
  },
  context: {},
  paymentSessionData: {},
}

// AUTHORIZE PAYMENT DATA

export const authorizePaymentSuccessData = {
  id: PaymentIntentDataByStatus.COMPLETED.id,
}

// CANCEL PAYMENT DATA

export const cancelPaymentSuccessData = {
  id: PaymentIntentDataByStatus.APPROVED.id,
  purchase_units: [
    {
      payments: {
        authorizations: [
          {
            id: "id",
          },
        ],
      },
    },
  ],
}

export const cancelPaymentRefundAlreadyCaptureSuccessData = {
  id: PaymentIntentDataByStatus.APPROVED.id,
  purchase_units: [
    {
      payments: {
        captures: [
          {
            id: "id",
          },
        ],
        authorizations: [
          {
            id: "id",
          },
        ],
      },
    },
  ],
}

export const cancelPaymentRefundAlreadyCanceledSuccessData = {
  id: PaymentIntentDataByStatus.VOIDED.id,
}

export const cancelPaymentFailData = {
  id: FAIL_INTENT_ID,
  purchase_units: [
    {
      payments: {
        captures: [
          {
            id: "id",
          },
        ],
        authorizations: [
          {
            id: "id",
          },
        ],
      },
    },
  ],
}

/*
export const cancelPaymentPartiallyFailData = {
  id: PARTIALLY_FAIL_INTENT_ID,
}*/
