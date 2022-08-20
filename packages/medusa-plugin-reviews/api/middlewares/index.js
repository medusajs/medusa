"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _awaitMiddleware = _interopRequireDefault(require("./await-middleware"));

var _default = {
  wrap: _awaitMiddleware["default"]
};
exports["default"] = _default;