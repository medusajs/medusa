"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _middlewares = _interopRequireDefault(require("../../middlewares"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var route = (0, _express.Router)();
var _default = function _default(app) {
  app.use("/hooks", route);
  route.post("/contentful", _bodyParser["default"].json(), _middlewares["default"].wrap(require("./contentful")["default"]));
  return app;
};
exports["default"] = _default;