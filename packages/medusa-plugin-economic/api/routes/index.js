"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _middlewares = _interopRequireDefault(require("../../middlewares"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var route = (0, _express.Router)();

var _default = function _default(app) {
  app.use("/economic", route);
  route.post("/draft-invoice", _middlewares["default"].wrap(require("./create-draft-invoice")["default"]));
  route.post("/book-invoice", _middlewares["default"].wrap(require("./book-invoice")["default"]));
  return app;
};

exports["default"] = _default;