"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _awaitMiddleware = _interopRequireDefault(require("./await-middleware"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  wrap: _awaitMiddleware["default"]
};
exports["default"] = _default;