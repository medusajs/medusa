"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _medusaInterfaces = require("medusa-interfaces");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var TestFulService = /*#__PURE__*/function (_FulfillmentService) {
  (0, _inherits2["default"])(TestFulService, _FulfillmentService);

  var _super = _createSuper(TestFulService);

  function TestFulService() {
    (0, _classCallCheck2["default"])(this, TestFulService);
    return _super.call(this);
  }

  (0, _createClass2["default"])(TestFulService, [{
    key: "getFulfillmentOptions",
    value: function getFulfillmentOptions() {
      return [{
        id: "manual-fulfillment"
      }];
    }
  }, {
    key: "validateFulfillmentData",
    value: function validateFulfillmentData(data, cart) {
      return data;
    }
  }, {
    key: "validateOption",
    value: function validateOption(data) {
      return true;
    }
  }, {
    key: "canCalculate",
    value: function canCalculate() {
      return false;
    }
  }, {
    key: "calculatePrice",
    value: function calculatePrice() {
      throw Error("Manual Fulfillment service cannot calculatePrice");
    }
  }, {
    key: "createOrder",
    value: function createOrder() {
      // No data is being sent anywhere
      return Promise.resolve({});
    }
  }, {
    key: "createFulfillment",
    value: function createFulfillment() {
      // No data is being sent anywhere
      return Promise.resolve({});
    }
  }, {
    key: "cancelFulfillment",
    value: function cancelFulfillment() {
      return Promise.resolve({});
    }
  }]);
  return TestFulService;
}(_medusaInterfaces.FulfillmentService);

TestFulService.identifier = "test-ful";
var _default = TestFulService;
exports["default"] = _default;