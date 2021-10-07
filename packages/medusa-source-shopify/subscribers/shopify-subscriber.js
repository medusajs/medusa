"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _medusaCoreUtils = require("medusa-core-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
        fulfillmentService = _ref.fulfillmentService,
        shopifyFulfillmentService = _ref.shopifyFulfillmentService,
        orderService = _ref.orderService,
        shopifyClientService = _ref.shopifyClientService;

    _classCallCheck(this, ShopifySubscriber);

    _defineProperty(this, "registerShopifyReturn", /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2) {
        var id, return_id, ret, order, fulfillmentOrders, shopifyPayment, refundItems, transactions, refundObject;
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
                _context.next = 9;
                return _this.client_.get({
                  path: "orders/".concat(order.external_id, "/fulfillment_orders")
                }).then(function (res) {
                  return res.body.fulfillment_orders;
                });

              case 9:
                fulfillmentOrders = _context.sent;
                shopifyPayment = order.payments[0];
                refundItems = ret.items.map(function (ri) {
                  return {
                    line_item_id: ri.metadata.sh_id,
                    quantity: ri.quantity,
                    restock_type: "return",
                    location_id: _this.getLocationId_(ri, fulfillmentOrders)
                  };
                });
                transactions = [{
                  amount: ret.refund_amount / 100,
                  kind: "refund",
                  parent_id: shopifyPayment.data.transaction_id,
                  gateway: shopifyPayment.data.gateway
                }];
                refundObject = {
                  refund: {
                    currency: order.currency_code.toUpperCase(),
                    note: "Medusa Commerce",
                    refund_line_items: refundItems,
                    transactions: transactions,
                    shipping: {
                      full_refund: true
                    },
                    notify: true
                  }
                }; //ShopifyRestClient can't handle this post for some unknown reason.. So we use axios

                _context.prev = 14;
                _context.next = 17;
                return _axios["default"].post("https://".concat(_this.options.domain, ".myshopify.com/admin/api/2021-10/orders/").concat(order.external_id, "/refunds.json"), refundObject, {
                  headers: {
                    "X-Shopify-Access-Token": _this.options.password,
                    "Content-Type": "application/json"
                  }
                });

              case 17:
                _context.next = 22;
                break;

              case 19:
                _context.prev = 19;
                _context.t0 = _context["catch"](14);
                throw new _medusaCoreUtils.MedusaError(_medusaCoreUtils.MedusaError.Types.INVALID_ARGUMENT, "An error occurend while issuing a refund to Shopify: ".concat(_context.t0.message));

              case 22:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[14, 19]]);
      }));

      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }());

    _defineProperty(this, "registerShopifyFulfillment", /*#__PURE__*/function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref4) {
        var id, fulfillment_id, fulfillment, order, fulfillmentOrders, items, fulfillmentObject, shId;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                id = _ref4.id, fulfillment_id = _ref4.fulfillment_id;
                _context2.next = 3;
                return _this.fulfillmentService_.retrieve(fulfillment_id);

              case 3:
                fulfillment = _context2.sent;
                _context2.next = 6;
                return _this.orderService_.retrieve(id, {
                  relations: ["items"]
                });

              case 6:
                order = _context2.sent;
                _context2.next = 9;
                return _this.client_.get({
                  path: "orders/".concat(order.external_id, "/fulfillment_orders")
                }).then(function (res) {
                  return res.body.fulfillment_orders;
                });

              case 9:
                fulfillmentOrders = _context2.sent;
                items = fulfillment.items.map(function (i) {
                  var shopifyId = order.items.find(function (li) {
                    return li.id === i.item_id;
                  }).metadata.sh_id;
                  return {
                    id: shopifyId,
                    quantity: i.quantity
                  };
                });
                fulfillmentObject = {
                  fulfillment: {
                    location_id: fulfillmentOrders[0].assigned_location_id,
                    line_items: items
                  }
                };
                _context2.next = 14;
                return _axios["default"].post("https://".concat(_this.options.domain, ".myshopify.com/admin/api/2021-10/orders/").concat(order.external_id, "/fulfillments.json"), fulfillmentObject, {
                  headers: {
                    "X-Shopify-Access-Token": _this.options.password,
                    "Content-Type": "application/json"
                  }
                }).then(function (res) {
                  return res.data.fulfillment.id;
                })["catch"](function (err) {
                  throw new _medusaCoreUtils.MedusaError(_medusaCoreUtils.MedusaError.Types.INVALID_DATA, "An error occured while attempting to issue a fulfillment create to Shopify: ".concat(err.message));
                });

              case 14:
                shId = _context2.sent;
                _context2.next = 17;
                return _this.shopifyFulfillmentService_.addShopifyId(fulfillment_id, shId);

              case 17:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x2) {
        return _ref5.apply(this, arguments);
      };
    }());

    _defineProperty(this, "registerShopifyFulfillmentCancel", /*#__PURE__*/function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref6) {
        var fulfillment_id, fulfillment;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                fulfillment_id = _ref6.fulfillment_id;
                _context3.next = 3;
                return _this.fulfillmentService_.retrieve(fulfillment_id);

              case 3:
                fulfillment = _context3.sent;
                _context3.next = 6;
                return _axios["default"].post("https://".concat(_this.options.domain, ".myshopify.com/admin/api/2021-10/fulfillments/").concat(fulfillment.metadata.sh_id, "/cancel.json"), {}, {
                  headers: {
                    "X-Shopify-Access-Token": _this.options.password
                  }
                })["catch"](function (err) {
                  throw new _medusaCoreUtils.MedusaError(_medusaCoreUtils.MedusaError.Types.INVALID_DATA, "An error occured while attempting to issue a fulfillment cancel to Shopify: ".concat(err.message));
                });

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x3) {
        return _ref7.apply(this, arguments);
      };
    }());

    this.options = options;
    this.eventBusService_ = eventBusService;
    this.returnService_ = returnService;
    this.fulfillmentService_ = fulfillmentService;
    this.shopifyFulfillmentService_ = shopifyFulfillmentService;
    this.orderService_ = orderService;
    this.client_ = shopifyClientService;
    eventBusService.subscribe("order.items_returned", this.registerShopifyReturn);
    eventBusService.subscribe("order.fulfillment_created", this.registerShopifyFulfillment);
    eventBusService.subscribe("order.fulfillment_canceled", this.registerShopifyFulfillmentCancel);
  }

  _createClass(ShopifySubscriber, [{
    key: "getLocationId_",
    value: function getLocationId_(returnItem) {
      var fulfillmentOrders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      var _iterator = _createForOfIteratorHelper(fulfillmentOrders),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var f = _step.value;
          var check = f.line_items.find(function (i) {
            return i.line_item_id === returnItem.metadata.sh_id;
          });

          if (check) {
            return f.assigned_location_id;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }]);

  return ShopifySubscriber;
}();

var _default = ShopifySubscriber;
exports["default"] = _default;