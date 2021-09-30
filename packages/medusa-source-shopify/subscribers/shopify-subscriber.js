"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _createClient = require("../utils/create-client");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ShopifySubscriber = /*#__PURE__*/function () {
  function ShopifySubscriber(_ref, options) {
    var _this = this;

    var eventBusService = _ref.eventBusService,
        returnService = _ref.returnService,
        orderService = _ref.orderService;

    _classCallCheck(this, ShopifySubscriber);

    _defineProperty(this, "registerShopifyReturn", /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2) {
        var id, return_id, ret, order, shopifyPayment, refundItems, transactions, refundObject;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                id = _ref2.id, return_id = _ref2.return_id;
                _context.next = 3;
                return _this.returnService_.retrieve(return_id);

              case 3:
                ret = _context.sent;
                _context.next = 6;
                return _this.orderService_.retrieve(id, {
                  relations: ["payments"]
                });

              case 6:
                order = _context.sent;
                shopifyPayment = order.payments[0];
                refundItems = ret.items.map(function (ri) {
                  return {
                    line_item_id: ri.item_id,
                    quantity: ri.quantity,
                    restock_type: "return",
                    location_id: _this.getStoreLocation()
                  };
                });
                transactions = [{
                  amount: ret.refund_amount,
                  kind: "refund",
                  // Include transaction_id and gateway when creating orders in the source plugin
                  parent_id: shopifyPayment.data.transaction_id,
                  gateway: shopifyPayment.data.gateway
                }];
                refundObject = {
                  currency: ret.order.currency_code.toUpperCase(),
                  note: "Medusa Commerce",
                  refund_line_items: refundItems,
                  transactions: transactions
                };
                _context.next = 13;
                return _this.client_.post({
                  path: "/orders/".concat(order.id, "/transactions"),
                  data: refundObject
                });

              case 13:
                return _context.abrupt("return", _context.sent);

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }());

    this.client_ = (0, _createClient.createClient)(options);
    this.eventBusService_ = eventBusService;
    this.returnService_ = returnService;
    this.orderService_ = orderService;
    eventBusService.subscribe("order.items_returned", this.registerShopifyReturn);
  }

  _createClass(ShopifySubscriber, [{
    key: "getStoreLocation",
    value: function getStoreLocation() {
      return "65350402255";
    }
  }]);

  return ShopifySubscriber;
}();

var _default = ShopifySubscriber;
exports["default"] = _default;