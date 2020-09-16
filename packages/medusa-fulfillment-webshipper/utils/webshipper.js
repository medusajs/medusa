"use strict";

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Webshipper = function Webshipper(_ref) {
  var _this = this;

  var account = _ref.account,
      token = _ref.token;

  _classCallCheck(this, Webshipper);

  _defineProperty(this, "buildShippingRateEndpoints", function () {
    return {
      list: function list() {
        var path = "/shipping_rates";
        return _this.client_({
          method: "GET",
          url: path
        }).then(function (_ref2) {
          var data = _ref2.data;
          return data;
        });
      }
    };
  });

  _defineProperty(this, "buildOrderEndpoints", function () {
    return {
      retrieve: function retrieve() {}
    };
  });

  this.account_ = account;
  this.token_ = token;
  this.client_ = _axios["default"].createClient({
    baseURL: "https://".concat(account, ".api.webshipper.io/v2"),
    headers: {
      Authorization: "Bearer ".concat(token)
    }
  });
  this.shippingRates = this.buildShippingRateEndpoints_();
  this.orders = this.buildOrderEndpoints_();
};