"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _hooks = _interopRequireDefault(require("./routes/hooks"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default(container) {
  var app = (0, _express.Router)();
  (0, _hooks["default"])(app);
  return app;
};

exports["default"] = _default;