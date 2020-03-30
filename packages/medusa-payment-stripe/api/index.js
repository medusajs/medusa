"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _default = function _default() {
  var app = (0, _express.Router)();
  app.get("/stripe", function (req, res) {
    console.log("hi");
    res.json({
      success: true
    });
  });
};

exports["default"] = _default;