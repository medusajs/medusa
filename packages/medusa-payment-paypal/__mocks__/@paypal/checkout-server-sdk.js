"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.PayPalMock = exports.PayPalClientMock = void 0;
var PayPalClientMock = {
  execute: jest.fn().mockImplementation(function (r) {
    return {
      result: r.result
    };
  })
};
exports.PayPalClientMock = PayPalClientMock;
var PayPalMock = {
  core: {
    SandboxEnvironment: function SandboxEnvironment() {
      this.env = {
        sandbox: true,
        live: false
      };
    },
    LiveEnvironment: function LiveEnvironment() {
      this.env = {
        sandbox: false,
        live: true
      };
    },
    PayPalHttpClient: function PayPalHttpClient() {
      return PayPalClientMock;
    }
  },
  payments: {
    AuthorizationsGetRequest: jest.fn().mockImplementation(function () {}),
    AuthorizationsVoidRequest: jest.fn().mockImplementation(function () {
      return {
        status: "VOIDED"
      };
    }),
    AuthorizationsCaptureRequest: jest.fn().mockImplementation(function () {
      return {
        result: {
          id: "test"
        },
        capture: true
      };
    }),
    CapturesRefundRequest: jest.fn().mockImplementation(function () {
      return {
        result: {
          id: "test"
        },
        status: "COMPLETED",
        invoice_id: 'invoice_id',
        body: null,
        requestBody: function requestBody(d) {
          this.body = d;
        }
      };
    })
  },
  orders: {
    OrdersCreateRequest: jest.fn().mockImplementation(function () {
      return {
        result: {
          id: "test"
        },
        order: true,
        body: null,
        requestBody: function requestBody(d) {
          this.body = d;
        }
      };
    }),
    OrdersPatchRequest: jest.fn().mockImplementation(function () {
      return {
        result: {
          id: "test"
        },
        order: true,
        body: null,
        requestBody: function requestBody(d) {
          this.body = d;
        }
      };
    }),
    OrdersGetRequest: jest.fn().mockImplementation(function (id) {
      switch (id) {
        case "test-refund":
          return {
            result: {
              id: "test-refund",
              status: "COMPLETED",
              invoice_id: "invoice_id"
            }
          };

        case "test-voided":
          return {
            result: {
              id: "test-voided",
              status: "VOIDED"
            }
          };

        default:
          return {
            result: {
              id: "test"
            }
          };
      }
    })
  }
};
exports.PayPalMock = PayPalMock;
var _default = PayPalMock;
exports["default"] = _default;