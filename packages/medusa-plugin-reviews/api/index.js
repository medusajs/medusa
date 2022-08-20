"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _routes = _interopRequireDefault(require("./routes"));

var _default = function _default(container) {
  var app = (0, _express.Router)();
  (0, _routes["default"])(app);
  return app;
};

exports["default"] = _default;