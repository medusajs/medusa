"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ProductReviewServiceMock = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _medusaTestUtils = require("medusa-test-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var ProductReviewServiceMock = {
  withTransaction: function withTransaction() {
    return this;
  },
  create: jest.fn().mockImplementation(function (data) {
    return Promise.resolve(_objectSpread({
      id: _medusaTestUtils.IdMap.getId("prev")
    }, data));
  }),
  retrieve: jest.fn().mockImplementation(function (id) {
    if (id === _medusaTestUtils.IdMap.getId("prev")) {
      return Promise.resolve({
        id: _medusaTestUtils.IdMap.getId("prev"),
        email: "admin@medusa-test.com"
      });
    }
  }),
  "delete": jest.fn().mockReturnValue(Promise.resolve()),
  update: jest.fn().mockReturnValue(Promise.resolve()),
  list: jest.fn().mockImplementation(function (data) {
    return Promise.resolve([{
      id: _medusaTestUtils.IdMap.getId("prev"),
      email: "admin@medusa-test.com"
    }]);
  }),
  listAndCount: jest.fn().mockImplementation(function (data) {
    return Promise.resolve([[{
      id: _medusaTestUtils.IdMap.getId("prev"),
      email: "admin@medusa-test.com"
    }], 1]);
  })
};
exports.ProductReviewServiceMock = ProductReviewServiceMock;
var mock = jest.fn().mockImplementation(function () {
  return ProductReviewServiceMock;
});
var _default = mock;
exports["default"] = _default;