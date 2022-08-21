"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _middlewares = _interopRequireDefault(require("../middlewares"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var route = (0, _express.Router)();

var _default = function _default(app) {
  app.use("/reviews", route);
  route.post("/", _bodyParser["default"].json(), _middlewares["default"].wrap(require("./create-product-review")["default"]));
  route.get("/", _middlewares["default"].wrap(require("./list-product-reviews")["default"]));
  return app;
};

exports["default"] = _default;