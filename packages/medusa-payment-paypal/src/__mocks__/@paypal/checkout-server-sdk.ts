import { PaymentIntentDataByStatus } from "../../__fixtures__/data";

export const WRONG_CUSTOMER_EMAIL = "wrong@test.fr"
export const EXISTING_CUSTOMER_EMAIL = "right@test.fr"
export const STRIPE_ID = "test"
export const PARTIALLY_FAIL_INTENT_ID = "partially_unknown"
export const FAIL_INTENT_ID = "unknown"

export const PayPalClientMock = {
  execute: jest.fn().mockImplementation((r) => {
    return {
      result: r.result,
    }
  }),
}

export const PayPalMock = {
  core: {
    env: {},
    SandboxEnvironment: function () {
      this.env = {
        sandbox: true,
        live: false,
      }
    },
    LiveEnvironment: function () {
      this.env = {
        sandbox: false,
        live: true,
      }
    },
    PayPalHttpClient: function () {
      return PayPalClientMock
    },
  },

  payments: {
    AuthorizationsGetRequest: jest.fn().mockImplementation(() => {}),
    AuthorizationsVoidRequest: jest.fn().mockImplementation(() => {
      return {
        status: "VOIDED"
      }
    }),
    AuthorizationsCaptureRequest: jest.fn().mockImplementation(() => {
      return {
        result: {
          id: "test",
        },
        capture: true,
      }
    }),
    CapturesRefundRequest: jest.fn().mockImplementation(() => {
      return {
        result: {
          id: "test",
        },
        status: "COMPLETED",
        invoice_id: 'invoice_id',
        body: null,
        requestBody: function (d) {
          this.body = d
        },
      }
    }),
  },

  orders: {
    OrdersCreateRequest: jest.fn().mockImplementation(() => {
      return {
        result: {
          id: "test",
        },
        order: true,
        body: null,
        requestBody: function (d) {
          this.body = d
        },
      }
    }),
    OrdersPatchRequest: jest.fn().mockImplementation(() => {
      return {
        result: {
          id: "test",
        },
        order: true,
        body: null,
        requestBody: function (d) {
          this.body = d
        },
      }
    }),
    OrdersGetRequest: jest.fn().mockImplementation(async (paymentId) => {
      if (paymentId === FAIL_INTENT_ID) {
        throw new Error("Error")
      }

      return Object.values(PaymentIntentDataByStatus).find(value => {
        return value.id === paymentId
      }) ?? {}
    }),
  },
}

export default PayPalMock
