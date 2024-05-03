"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var OrderSubscriber = /*#__PURE__*/_createClass(function OrderSubscriber(_ref) {
  var notificationService = _ref.notificationService;
  _classCallCheck(this, OrderSubscriber);
  this.notificationService_ = notificationService;
  this.notificationService_.subscribe("order.shipment_created", "sendgrid");
  this.notificationService_.subscribe("order.gift_card_created", "sendgrid");
  this.notificationService_.subscribe("gift_card.created", "sendgrid");
  this.notificationService_.subscribe("order.placed", "sendgrid");
  this.notificationService_.subscribe("order.canceled", "sendgrid");
  this.notificationService_.subscribe("customer.password_reset", "sendgrid");
  this.notificationService_.subscribe("claim.shipment_created", "sendgrid");
  this.notificationService_.subscribe("swap.shipment_created", "sendgrid");
  this.notificationService_.subscribe("swap.created", "sendgrid");
  this.notificationService_.subscribe("order.items_returned", "sendgrid");
  this.notificationService_.subscribe("order.return_requested", "sendgrid");
  this.notificationService_.subscribe("order.refund_created", "sendgrid");
});
var _default = OrderSubscriber;
exports["default"] = _default;