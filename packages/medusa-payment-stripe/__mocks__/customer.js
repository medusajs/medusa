"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.CustomerServiceMock = void 0;

var _medusaTestUtils = require("medusa-test-utils");

var CustomerServiceMock = {
  retrieve: jest.fn().mockImplementation(function (id) {
    if (id === _medusaTestUtils.IdMap.getId("lebron")) {
      return Promise.resolve({
        _id: _medusaTestUtils.IdMap.getId("lebron"),
        first_name: "LeBron",
        last_name: "James",
        email: "lebron@james.com",
        password_hash: "1234",
        metadata: {
          stripe_id: "cus_123456789_new"
        }
      });
    }

    if (id === _medusaTestUtils.IdMap.getId("vvd")) {
      return Promise.resolve({
        _id: _medusaTestUtils.IdMap.getId("vvd"),
        first_name: "Virgil",
        last_name: "Van Dijk",
        email: "virg@vvd.com",
        password_hash: "1234",
        metadata: {}
      });
    }

    return Promise.resolve(undefined);
  }),
  setMetadata: jest.fn().mockReturnValue(Promise.resolve())
};
exports.CustomerServiceMock = CustomerServiceMock;
var mock = jest.fn().mockImplementation(function () {
  return CustomerServiceMock;
});
var _default = mock;
exports["default"] = _default;