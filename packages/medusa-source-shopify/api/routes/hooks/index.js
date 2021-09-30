"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _order = _interopRequireDefault(require("./order"));

var _product = _interopRequireDefault(require("./product"));

var _refund = _interopRequireDefault(require("./refund"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var route = (0, _express.Router)();

var _default = function _default(app) {
  app.use("/shopify", route);
  (0, _order["default"])(route);
  (0, _product["default"])(route);
  (0, _refund["default"])(route);
  return app;
};

exports["default"] = _default;