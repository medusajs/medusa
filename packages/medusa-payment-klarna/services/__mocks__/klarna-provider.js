"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.KlarnaProviderServiceMock = void 0;

var _medusaTestUtils = require("medusa-test-utils");

var KlarnaProviderServiceMock = {
  retrievePayment: jest.fn().mockImplementation(function (cart) {
    if (cart._id === _medusaTestUtils.IdMap.getId("fr-cart")) {
      return Promise.resolve({
        order_id: "123456789"
      });
    }

    return Promise.resolve(undefined);
  }),
  cancelPayment: jest.fn().mockImplementation(function (cart) {
    return Promise.resolve();
  }),
  updatePayment: jest.fn().mockImplementation(function (cart) {
    return Promise.resolve();
  }),
  capturePayment: jest.fn().mockImplementation(function (cart) {
    if (cart._id === _medusaTestUtils.IdMap.getId("fr-cart")) {
      return Promise.resolve({
        id: "123456789"
      });
    }

    return Promise.resolve(undefined);
  }),
  createPayment: jest.fn().mockImplementation(function (cart) {
    if (cart._id === _medusaTestUtils.IdMap.getId("fr-cart")) {
      return Promise.resolve({
        id: "123456789",
        order_amount: 100
      });
    }

    return Promise.resolve(undefined);
  })
};
exports.KlarnaProviderServiceMock = KlarnaProviderServiceMock;
var mock = jest.fn().mockImplementation(function () {
  return KlarnaProviderServiceMock;
});
var _default = mock;
exports["default"] = _default;