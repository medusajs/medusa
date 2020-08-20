"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.RegionServiceMock = void 0;

var _medusaTestUtils = require("medusa-test-utils");

var RegionServiceMock = {
  retrieve: jest.fn().mockImplementation(function (regionId) {
    return Promise.resolve({
      _id: _medusaTestUtils.IdMap.getId("testRegion"),
      name: "Test Region",
      countries: ["DK", "US", "DE"],
      tax_rate: 0.25,
      payment_providers: ["default_provider", "unregistered"],
      fulfillment_providers: ["test_shipper"],
      currency_code: "usd"
    });
  })
};
exports.RegionServiceMock = RegionServiceMock;
var mock = jest.fn().mockImplementation(function () {
  return RegionServiceMock;
});
var _default = mock;
exports["default"] = _default;