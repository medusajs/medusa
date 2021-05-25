export const PayPalClientMock = {
  execute: jest.fn().mockImplementation((r) => {
    return {
      result: r.result,
    }
  }),
}

export const PayPalMock = {
  core: {
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
    AuthorizationsVoidRequest: jest.fn().mockImplementation(() => {}),
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
    OrdersGetRequest: jest.fn().mockImplementation(() => {
      return {
        result: {
          id: "test",
        },
      }
    }),
  },
}

export default PayPalMock
