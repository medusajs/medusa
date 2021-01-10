"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.StripeMock = void 0;
var StripeMock = {
  customers: {
    create: jest.fn().mockImplementation(function (data) {
      if (data.email === "virg@vvd.com") {
        return Promise.resolve({
          id: "cus_vvd",
          email: "virg@vvd.com"
        });
      }

      if (data.email === "lebron@james.com") {
        return Promise.resolve({
          id: "cus_lebron",
          email: "lebron@james.com"
        });
      }
    })
  },
  paymentIntents: {
    create: jest.fn().mockImplementation(function (data) {
      if (data.customer === "cus_123456789_new") {
        return Promise.resolve({
          id: "pi_lebron",
          amount: 100,
          customer: "cus_123456789_new"
        });
      }

      if (data.customer === "cus_lebron") {
        return Promise.resolve({
          id: "pi_lebron",
          amount: 100,
          customer: "cus_lebron"
        });
      }
    }),
    retrieve: jest.fn().mockImplementation(function (data) {
      return Promise.resolve({
        id: "pi_lebron",
        customer: "cus_lebron"
      });
    }),
    update: jest.fn().mockImplementation(function (pi, data) {
      if (data.customer === "cus_lebron_2") {
        return Promise.resolve({
          id: "pi_lebron",
          customer: "cus_lebron_2",
          amount: 1000
        });
      }

      return Promise.resolve({
        id: "pi_lebron",
        customer: "cus_lebron",
        amount: 1000
      });
    }),
    capture: jest.fn().mockImplementation(function (data) {
      return Promise.resolve({
        id: "pi_lebron",
        customer: "cus_lebron",
        amount: 1000,
        status: "succeeded"
      });
    }),
    cancel: jest.fn().mockImplementation(function (data) {
      return Promise.resolve({
        id: "pi_lebron",
        customer: "cus_lebron",
        status: "cancelled"
      });
    })
  },
  refunds: {
    create: jest.fn().mockImplementation(function (data) {
      return Promise.resolve({
        id: "re_123",
        payment_intent: "pi_lebron",
        amount: 1000,
        status: "succeeded"
      });
    })
  }
};
exports.StripeMock = StripeMock;
var stripe = jest.fn(function () {
  return StripeMock;
});
var _default = stripe;
exports["default"] = _default;