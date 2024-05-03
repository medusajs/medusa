"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _medusaInterfaces = require("medusa-interfaces");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var ManualFulfillmentService = /*#__PURE__*/function (_FulfillmentService) {
  _inherits(ManualFulfillmentService, _FulfillmentService);
  var _super = _createSuper(ManualFulfillmentService);
  function ManualFulfillmentService() {
    _classCallCheck(this, ManualFulfillmentService);
    return _super.call(this);
  }
  _createClass(ManualFulfillmentService, [{
    key: "getFulfillmentOptions",
    value: function getFulfillmentOptions() {
      return [{
        id: "manual-fulfillment"
      }, {
        id: "manual-fulfillment-return",
        is_return: true
      }];
    }
  }, {
    key: "validateFulfillmentData",
    value: function validateFulfillmentData(_, data, cart) {
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
    key: "createReturn",
    value: function createReturn() {
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
  }, {
    key: "retrieveDocuments",
    value: function retrieveDocuments() {
      return Promise.resolve([]);
    }
  }]);
  return ManualFulfillmentService;
}(_medusaInterfaces.FulfillmentService);
_defineProperty(ManualFulfillmentService, "identifier", "manual");
var _default = ManualFulfillmentService;
exports["default"] = _default;