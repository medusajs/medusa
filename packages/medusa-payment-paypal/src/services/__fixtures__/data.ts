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

// CAPTURE PAYMENT DATA

export const capturePaymentContextSuccessData = {
  paymentSessionData: {
    id: PaymentIntentDataByStatus.APPROVED.id,
    purchase_units: [
      {
        payments: {
          authorizations: [
            {
              id: SUCCESS_INTENT,
            },
          ],
        },
      },
    ],
  },
}

export const capturePaymentContextFailData = {
  paymentSessionData: {
    id: PaymentIntentDataByStatus.APPROVED.id,
    purchase_units: [
      {
        payments: {
          authorizations: [
            {
              id: FAIL_INTENT_ID,
            },
          ],
        },
      },
    ],
  },
}

// REFUND PAYMENT DATA

export const refundPaymentSuccessData = {
  id: PaymentIntentDataByStatus.APPROVED.id,
  purchase_units: [
    {
      amount: {
        currency_code: "USD",
        value: "100.00",
      },
      payments: {
        captures: [
          {
            id: "id",
          },
        ],
        authorizations: [
          {
            id: FAIL_INTENT_ID,
          },
        ],
      },
    },
  ],
}

export const refundPaymentFailNotYetCapturedData = {
  id: PaymentIntentDataByStatus.APPROVED.id,
  purchase_units: [
    {
      payments: {
        captures: [],
        authorizations: [
          {
            id: FAIL_INTENT_ID,
          },
        ],
      },
    },
  ],
}

export const refundPaymentFailData = {
  id: FAIL_INTENT_ID,
  purchase_units: [
    {
      amount: {
        currency_code: "USD",
        value: "100.00",
      },
      payments: {
        captures: [
          {
            id: "id",
          },
        ],
        authorizations: [
          {
            id: FAIL_INTENT_ID,
          },
        ],
      },
    },
  ],
}

// RETRIEVE PAYMENT DATA

export const retrievePaymentSuccessData = {
  id: PaymentIntentDataByStatus.APPROVED.id,
}

export const retrievePaymentFailData = {
  id: FAIL_INTENT_ID,
}

// UPDATE PAYMENT DATA

export const updatePaymentSuccessData = {
  paymentSessionData: {
    id: PaymentIntentDataByStatus.APPROVED.id,
  },
  currency_code: "USD",
  amount: 1000,
}

export const updatePaymentFailData = {
  currency_code: "USD",
  amount: 1000,
  resource_id: FAIL_INTENT_ID,
  customer: {
    metadata: {
      stripe_id: "test",
    },
  },
  context: {},
  paymentSessionData: {
    id: FAIL_INTENT_ID,
  },
}
