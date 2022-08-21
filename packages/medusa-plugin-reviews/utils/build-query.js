"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildQuery = buildQuery;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

function buildQuery(query) {
  var path = "";

  if (query) {
    var queryString = Object.entries(query).map(function (_ref) {
      var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      return "".concat(key, "=").concat(value);
    });
    path = "?".concat(queryString.join("&"));
  }

  return path;
}