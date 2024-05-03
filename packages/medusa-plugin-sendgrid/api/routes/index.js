"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _middleware = _interopRequireDefault(require("../middleware"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var route = (0, _express.Router)();
var _default = function _default(app) {
  app.use("/sendgrid", route);
  route.post("/send", _bodyParser["default"].raw({
    type: "application/json"
  }), _middleware["default"].wrap(require("./send-email")["default"]));
  return app;
};
exports["default"] = _default;