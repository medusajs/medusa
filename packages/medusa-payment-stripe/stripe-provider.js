"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.StripeProviderServiceMock = void 0;

var _medusaTestUtils = require("medusa-test-utils");

var StripeProviderServiceMock = {
  withTransaction: function withTransaction() {
    return this;
  },
  retrievePayment: jest.fn().mockImplementation(function (payData) {
    if (payData.id === "pi_123456789") {
      return Promise.resolve({
        id: "pi",
        customer: "cus_123456789"
      });
    }

    if (payData.id === "pi_no") {
      return Promise.resolve({
        id: "pi_no"
      });
    }

    return Promise.resolve(undefined);
  }),
  cancelPayment: jest.fn().mockImplementation(function (cart) {
    return Promise.resolve();
  }),
  updatePaymentIntentCustomer: jest.fn().mockImplementation(function (cart) {
    return Promise.resolve();
  }),
  retrieveCustomer: jest.fn().mockImplementation(function (customerId) {
    if (customerId === "cus_123456789_new") {
      return Promise.resolve({
        id: "cus_123456789_new"
      });
    }

    return Promise.resolve(undefined);
  }),
  createCustomer: jest.fn().mockImplementation(function (customer) {
    if (customer._id === _medusaTestUtils.IdMap.getId("vvd")) {
      return Promise.resolve({
        id: "cus_123456789_new_vvd"
      });
    }

    return Promise.resolve(undefined);
  }),
  createPayment: jest.fn().mockImplementation(function (cart) {
    return Promise.resolve({
      id: "pi_new",
      customer: "cus_123456789_new"
    });
  })
};
exports.StripeProviderServiceMock = StripeProviderServiceMock;
var mock = jest.fn().mockImplementation(function () {
  return StripeProviderServiceMock;
});
var _default = mock;
exports["default"] = _default;