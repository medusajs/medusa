"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports["default"] = void 0;

var _express = require("express");

var _middlewares = _interopRequireDefault(require("../middlewares"));

var _createProductReview = require("./create-product-review");

Object.keys(_createProductReview).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _createProductReview[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _createProductReview[key];
    }
  });
});

var _listProductReviews = require("./list-product-reviews");

Object.keys(_listProductReviews).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _listProductReviews[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _listProductReviews[key];
    }
  });
});
var route = (0, _express.Router)();

var _default = function _default(app) {
  app.use("/reviews", route);
  route.post("/", _middlewares["default"].wrap(require("./create-product-review")["default"]));
  route.get("/", _middlewares["default"].wrap(require("./list-product-reviews")["default"]));
  return app;
};

exports["default"] = _default;