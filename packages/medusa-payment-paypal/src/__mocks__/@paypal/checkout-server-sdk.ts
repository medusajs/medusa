import { PaymentIntentDataByStatus } from "../../__fixtures__/data";

export const SUCCESS_INTENT = "right@test.fr"
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
          if (d.purchase_units[0].custom_id === SUCCESS_INTENT) {
            this.body = d
            return
          }
          throw new Error("Error.")
        }
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
    OrdersGetRequest: jest.fn().mockImplementation((paymentId) => {
      if (paymentId === FAIL_INTENT_ID) {
        throw new Error("Error")
      }

      return {
        result: Object.values(PaymentIntentDataByStatus).find(value => {
          return value.id === paymentId
        }) ?? {}
      }
    }),
  },
}

export default PayPalMock
