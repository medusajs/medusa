"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _medusaInterfaces = require("medusa-interfaces");

var _parsePrice = require("../utils/parse-price");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ShopifyOrderService = /*#__PURE__*/function (_BaseService) {
  _inherits(ShopifyOrderService, _BaseService);

  var _super = _createSuper(ShopifyOrderService);

  function ShopifyOrderService(_ref, options) {
    var _this;

    var manager = _ref.manager,
        orderService = _ref.orderService,
        orderRepository = _ref.orderRepository,
        shopifyProviderService = _ref.shopifyProviderService,
        regionService = _ref.regionService,
        shopifyCustomerService = _ref.shopifyCustomerService,
        shopifyLineItemService = _ref.shopifyLineItemService,
        shopifyClientService = _ref.shopifyClientService;

    _classCallCheck(this, ShopifyOrderService);

    _this = _super.call(this);
    _this.options = options;
    /** @private @const {EntityManager} */

    _this.manager_ = manager;
    /** @private @const {ShopifyLineItemService} */

    _this.lineItemService_ = shopifyLineItemService;
    /** @private @const {ShopifyProviderService} */

    _this.paymentProvider = shopifyProviderService;
    /** @private @const {ShopifyCustomerService} */

    _this.customerService_ = shopifyCustomerService;
    /** @private @const {RegionService} */

    _this.regionService_ = regionService;
    /** @private @const {OrderService} */

    _this.orderService_ = orderService;
    /** @private @const {OrderRepository} */

    _this.orderRepository_ = orderRepository;
    /** @private @const {ShopifyClientService} */

    _this.client_ = shopifyClientService;
    return _this;
  }

  _createClass(ShopifyOrderService, [{
    key: "withTransaction",
    value: function withTransaction(transactionManager) {
      if (!transactionManager) {
        return this;
      }

      var cloned = new ShopifyOrderService({
        manager: transactionManager,
        options: this.options,
        shopifyProvider: this.paymentRepository_,
        orderService: this.orderService_,
        shopifyCustomerService: this.customerService_,
        shopifyClientService: this.client_
      });
      cloned.transactionManager_ = transactionManager;
      return cloned;
    }
    /**
     * Creates an order based on an event from Shopify.
     * @param {object} order
     */

  }, {
    key: "create",
    value: function () {
      var _create = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data) {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(manager) {
                    var _yield$_this2$custome, customerId, normalized, order, _iterator, _step, shippingLine, transactionResponse, transactions, _iterator2, _step2, transaction;

                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return _this2.customerService_.withTransaction(manager).create(data);

                          case 2:
                            _yield$_this2$custome = _context.sent;
                            customerId = _yield$_this2$custome.id;
                            _context.next = 6;
                            return _this2.normalizeOrder_(data, customerId);

                          case 6:
                            normalized = _context.sent;

                            if (normalized) {
                              _context.next = 9;
                              break;
                            }

                            throw new MedusaError(MedusaError.Types.INVALID_DATA, "An error occurred while normalizing the order");

                          case 9:
                            _context.next = 11;
                            return _this2.orderService_.withTransaction(manager).create(normalized);

                          case 11:
                            order = _context.sent;
                            _iterator = _createForOfIteratorHelper(data.shipping_lines);
                            _context.prev = 13;

                            _iterator.s();

                          case 15:
                            if ((_step = _iterator.n()).done) {
                              _context.next = 21;
                              break;
                            }

                            shippingLine = _step.value;
                            _context.next = 19;
                            return _this2.addShippingMethod_(shippingLine, order.id);

                          case 19:
                            _context.next = 15;
                            break;

                          case 21:
                            _context.next = 26;
                            break;

                          case 23:
                            _context.prev = 23;
                            _context.t0 = _context["catch"](13);

                            _iterator.e(_context.t0);

                          case 26:
                            _context.prev = 26;

                            _iterator.f();

                            return _context.finish(26);

                          case 29:
                            _context.next = 31;
                            return _this2.client_.get({
                              path: "orders/".concat(data.id, "/transactions")
                            });

                          case 31:
                            transactionResponse = _context.sent;
                            transactions = transactionResponse.body.transactions;
                            _iterator2 = _createForOfIteratorHelper(transactions);
                            _context.prev = 34;

                            _iterator2.s();

                          case 36:
                            if ((_step2 = _iterator2.n()).done) {
                              _context.next = 42;
                              break;
                            }

                            transaction = _step2.value;
                            _context.next = 40;
                            return _this2.paymentProvider.withTransaction(manager).createPayment({
                              order_id: order.id,
                              currency_code: transaction.currency.toLowerCase(),
                              total: (0, _parsePrice.parsePrice)(transaction.amount),
                              data: {
                                transaction_id: transaction.id,
                                gateway: transaction.gateway
                              },
                              status: transaction.status,
                              processed_at: transaction.processed_at
                            });

                          case 40:
                            _context.next = 36;
                            break;

                          case 42:
                            _context.next = 47;
                            break;

                          case 44:
                            _context.prev = 44;
                            _context.t1 = _context["catch"](34);

                            _iterator2.e(_context.t1);

                          case 47:
                            _context.prev = 47;

                            _iterator2.f();

                            return _context.finish(47);

                          case 50:
                            return _context.abrupt("return", order);

                          case 51:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee, null, [[13, 23, 26, 29], [34, 44, 47, 50]]);
                  }));

                  return function (_x2) {
                    return _ref2.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function create(_x) {
        return _create.apply(this, arguments);
      }

      return create;
    }()
    /**
     * Updates an order based on an event from Shopify
     * @param {object} order
     */

  }, {
    key: "update",
    value: function () {
      var _update = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(data) {
        var _this3 = this;

        return regeneratorRuntime.wrap(function _callee4$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(manager) {
                    var order, refunds, shipping_address, shippingAddress, update, sh_refunds, sh_deleted_items, _iterator3, _step3, _loop, _iterator4, _step4, _loop2, _iterator5, _step5, refund, _iterator6, _step6, _loop3;

                    return regeneratorRuntime.wrap(function _callee3$(_context6) {
                      while (1) {
                        switch (_context6.prev = _context6.next) {
                          case 0:
                            _context6.next = 2;
                            return _this3.retrieve(data.id, {
                              relations: ["items", "shipping_address"]
                            });

                          case 2:
                            order = _context6.sent;
                            refunds = data.refunds, shipping_address = data.shipping_address;
                            shippingAddress = _this3.normalizeBilling_(shipping_address);
                            update = {
                              metadata: _objectSpread({}, order.metadata)
                            }; //Need to track refunds so we avoid handling them multiple times, as they are persisted on the order.

                            //Need to track refunds so we avoid handling them multiple times, as they are persisted on the order.
                            sh_refunds = order.metadata && order.metadata.sh_refunds ? order.metadata.sh_refunds : []; //Even if an item is deleted from an order it is persisted in its line items, therefore we need to keep
                            //track of deleted items, so that they are not re-added.

                            //Even if an item is deleted from an order it is persisted in its line items, therefore we need to keep
                            //track of deleted items, so that they are not re-added.
                            sh_deleted_items = order.metadata && order.metadata.sh_deleted_items ? order.metadata.sh_deleted_items : [];
                            _context6.next = 10;
                            return _this3.orderService_.withTransaction(manager).updateShippingAddress_(order, shippingAddress);

                          case 10:
                            _iterator3 = _createForOfIteratorHelper(order.items);
                            _context6.prev = 11;
                            _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop() {
                              var item, match;
                              return regeneratorRuntime.wrap(function _loop$(_context3) {
                                while (1) {
                                  switch (_context3.prev = _context3.next) {
                                    case 0:
                                      item = _step3.value;
                                      match = data.line_items.find(function (i) {
                                        return i.id === item.metadata.sh_id;
                                      });

                                      if (!(match.quantity > match.fulfillable_quantity && match.fulfillable_quantity > 0)) {
                                        _context3.next = 7;
                                        break;
                                      }

                                      _context3.next = 5;
                                      return _this3.lineItemService_.withTransaction(manager).update({
                                        item_id: item.id,
                                        quantity: match.fulfillable_quantity
                                      });

                                    case 5:
                                      _context3.next = 16;
                                      break;

                                    case 7:
                                      if (!(match.fulfillable_quantity === 0)) {
                                        _context3.next = 13;
                                        break;
                                      }

                                      _context3.next = 10;
                                      return _this3.lineItemService_.withTransaction(manager)["delete"](item.id);

                                    case 10:
                                      sh_deleted_items.push(match.id);
                                      _context3.next = 16;
                                      break;

                                    case 13:
                                      if (!(match && match.quantity !== item.quantity)) {
                                        _context3.next = 16;
                                        break;
                                      }

                                      _context3.next = 16;
                                      return _this3.lineItemService_.withTransaction(manager).update({
                                        item_id: item.id,
                                        quantity: match.quantity
                                      });

                                    case 16:
                                    case "end":
                                      return _context3.stop();
                                  }
                                }
                              }, _loop);
                            });

                            _iterator3.s();

                          case 14:
                            if ((_step3 = _iterator3.n()).done) {
                              _context6.next = 18;
                              break;
                            }

                            return _context6.delegateYield(_loop(), "t0", 16);

                          case 16:
                            _context6.next = 14;
                            break;

                          case 18:
                            _context6.next = 23;
                            break;

                          case 20:
                            _context6.prev = 20;
                            _context6.t1 = _context6["catch"](11);

                            _iterator3.e(_context6.t1);

                          case 23:
                            _context6.prev = 23;

                            _iterator3.f();

                            return _context6.finish(23);

                          case 26:
                            _iterator4 = _createForOfIteratorHelper(data.line_items);
                            _context6.prev = 27;
                            _loop2 = /*#__PURE__*/regeneratorRuntime.mark(function _loop2() {
                              var item, match;
                              return regeneratorRuntime.wrap(function _loop2$(_context4) {
                                while (1) {
                                  switch (_context4.prev = _context4.next) {
                                    case 0:
                                      item = _step4.value;
                                      match = order.items.find(function (i) {
                                        return i.metadata.sh_id === item.id;
                                      });

                                      if (!(!match && !sh_deleted_items.includes(item.id))) {
                                        _context4.next = 5;
                                        break;
                                      }

                                      _context4.next = 5;
                                      return _this3.lineItemService_.withTransaction(manager).create(order.id, item);

                                    case 5:
                                    case "end":
                                      return _context4.stop();
                                  }
                                }
                              }, _loop2);
                            });

                            _iterator4.s();

                          case 30:
                            if ((_step4 = _iterator4.n()).done) {
                              _context6.next = 34;
                              break;
                            }

                            return _context6.delegateYield(_loop2(), "t2", 32);

                          case 32:
                            _context6.next = 30;
                            break;

                          case 34:
                            _context6.next = 39;
                            break;

                          case 36:
                            _context6.prev = 36;
                            _context6.t3 = _context6["catch"](27);

                            _iterator4.e(_context6.t3);

                          case 39:
                            _context6.prev = 39;

                            _iterator4.f();

                            return _context6.finish(39);

                          case 42:
                            _iterator5 = _createForOfIteratorHelper(refunds);
                            _context6.prev = 43;

                            _iterator5.s();

                          case 45:
                            if ((_step5 = _iterator5.n()).done) {
                              _context6.next = 67;
                              break;
                            }

                            refund = _step5.value;

                            if (sh_refunds.includes(refund.id)) {
                              _context6.next = 65;
                              break;
                            }

                            _iterator6 = _createForOfIteratorHelper(refund.refund_line_items);
                            _context6.prev = 49;
                            _loop3 = /*#__PURE__*/regeneratorRuntime.mark(function _loop3() {
                              var refundLine, match, newQuantity;
                              return regeneratorRuntime.wrap(function _loop3$(_context5) {
                                while (1) {
                                  switch (_context5.prev = _context5.next) {
                                    case 0:
                                      refundLine = _step6.value;
                                      match = order.items.find(function (i) {
                                        return i.metadata.sh_id === refundLine.line_item_id;
                                      });
                                      newQuantity = match.quantity - refundLine.quantity;

                                      if (!(newQuantity > 0)) {
                                        _context5.next = 8;
                                        break;
                                      }

                                      _context5.next = 6;
                                      return _this3.lineItemService_.withTransaction(manager).update({
                                        item_id: match.id,
                                        quantity: newQuantity
                                      });

                                    case 6:
                                      _context5.next = 11;
                                      break;

                                    case 8:
                                      _context5.next = 10;
                                      return _this3.lineItemService_.withTransaction(manager)["delete"](match.id);

                                    case 10:
                                      sh_deleted_items.push(match.metadata.sh_id);

                                    case 11:
                                    case "end":
                                      return _context5.stop();
                                  }
                                }
                              }, _loop3);
                            });

                            _iterator6.s();

                          case 52:
                            if ((_step6 = _iterator6.n()).done) {
                              _context6.next = 56;
                              break;
                            }

                            return _context6.delegateYield(_loop3(), "t4", 54);

                          case 54:
                            _context6.next = 52;
                            break;

                          case 56:
                            _context6.next = 61;
                            break;

                          case 58:
                            _context6.prev = 58;
                            _context6.t5 = _context6["catch"](49);

                            _iterator6.e(_context6.t5);

                          case 61:
                            _context6.prev = 61;

                            _iterator6.f();

                            return _context6.finish(61);

                          case 64:
                            sh_refunds.push(refund.id);

                          case 65:
                            _context6.next = 45;
                            break;

                          case 67:
                            _context6.next = 72;
                            break;

                          case 69:
                            _context6.prev = 69;
                            _context6.t6 = _context6["catch"](43);

                            _iterator5.e(_context6.t6);

                          case 72:
                            _context6.prev = 72;

                            _iterator5.f();

                            return _context6.finish(72);

                          case 75:
                            if (data.email !== order.email) {
                              update.email = data.email;
                            }

                            if (!_lodash["default"].isEmpty(sh_refunds)) {
                              update.metadata = _objectSpread(_objectSpread({}, update.metadata), {}, {
                                sh_refunds: sh_refunds
                              });
                            }

                            if (!_lodash["default"].isEmpty(sh_deleted_items)) {
                              update.metadata = _objectSpread(_objectSpread({}, update.metadata), {}, {
                                sh_deleted_items: sh_deleted_items
                              });
                            }

                            if (_lodash["default"].isEmpty(update)) {
                              _context6.next = 81;
                              break;
                            }

                            _context6.next = 81;
                            return _this3.orderService_.withTransaction(manager).update(order.id, update);

                          case 81:
                          case "end":
                            return _context6.stop();
                        }
                      }
                    }, _callee3, null, [[11, 20, 23, 26], [27, 36, 39, 42], [43, 69, 72, 75], [49, 58, 61, 64]]);
                  }));

                  return function (_x4) {
                    return _ref3.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee4, this);
      }));

      function update(_x3) {
        return _update.apply(this, arguments);
      }

      return update;
    }()
    /**
     * Deletes an order based on an event from Shopify.
     * @param {object} order
     */

  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(id) {
        var _this4 = this;

        return regeneratorRuntime.wrap(function _callee6$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                return _context9.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(manager) {
                    var order;
                    return regeneratorRuntime.wrap(function _callee5$(_context8) {
                      while (1) {
                        switch (_context8.prev = _context8.next) {
                          case 0:
                            _context8.next = 2;
                            return _this4.retrieve(id);

                          case 2:
                            order = _context8.sent;
                            _context8.next = 5;
                            return _this4.orderService_.withTransaction(manager)["delete"](order.id);

                          case 5:
                          case "end":
                            return _context8.stop();
                        }
                      }
                    }, _callee5);
                  }));

                  return function (_x6) {
                    return _ref4.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee6, this);
      }));

      function _delete(_x5) {
        return _delete2.apply(this, arguments);
      }

      return _delete;
    }()
    /**
     * Archives an order based on an event from Shopify
     * @param {string} id
     * @returns
     */

  }, {
    key: "archive",
    value: function () {
      var _archive = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(id) {
        var _this5 = this;

        return regeneratorRuntime.wrap(function _callee8$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                return _context11.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(manager) {
                    var order;
                    return regeneratorRuntime.wrap(function _callee7$(_context10) {
                      while (1) {
                        switch (_context10.prev = _context10.next) {
                          case 0:
                            _context10.next = 2;
                            return _this5.retrieve(id);

                          case 2:
                            order = _context10.sent;
                            _context10.next = 5;
                            return _this5.orderService_.withTransaction(manager).archive(order.id);

                          case 5:
                            return _context10.abrupt("return", _context10.sent);

                          case 6:
                          case "end":
                            return _context10.stop();
                        }
                      }
                    }, _callee7);
                  }));

                  return function (_x8) {
                    return _ref5.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee8, this);
      }));

      function archive(_x7) {
        return _archive.apply(this, arguments);
      }

      return archive;
    }()
    /**
     * Handles a refund issued through Shopify. Refunds cover both
     * actual refunds and line item removals or quantity adjustments.
     * @param {object} refund
     */

  }, {
    key: "refund",
    value: function () {
      var _refund2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(_refund) {
        return regeneratorRuntime.wrap(function _callee9$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                if ("refund_line_items" in _refund) {}

                if ("order_adjustments" in _refund) {}

                return _context12.abrupt("return", Promise.resolve());

              case 3:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee9);
      }));

      function refund(_x9) {
        return _refund2.apply(this, arguments);
      }

      return refund;
    }()
    /**
     * Retrieves an order by Shopify Id
     * @param {string} shopifyId
     * @param {object} config
     */

  }, {
    key: "retrieve",
    value: function () {
      var _retrieve = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(shopifyId) {
        var config,
            _args13 = arguments;
        return regeneratorRuntime.wrap(function _callee10$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                config = _args13.length > 1 && _args13[1] !== undefined ? _args13[1] : {};
                _context13.next = 3;
                return this.orderService_.retrieveByExternalId(shopifyId, config);

              case 3:
                return _context13.abrupt("return", _context13.sent);

              case 4:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee10, this);
      }));

      function retrieve(_x10) {
        return _retrieve.apply(this, arguments);
      }

      return retrieve;
    }()
  }, {
    key: "cancel",
    value: function () {
      var _cancel = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(id) {
        var order;
        return regeneratorRuntime.wrap(function _callee11$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.next = 2;
                return this.retrieve(id);

              case 2:
                order = _context14.sent;
                _context14.next = 5;
                return this.orderService_.withTransaction(manager).cancel(order.id);

              case 5:
                return _context14.abrupt("return", _context14.sent);

              case 6:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee11, this);
      }));

      function cancel(_x11) {
        return _cancel.apply(this, arguments);
      }

      return cancel;
    }()
  }, {
    key: "addShippingMethod_",
    value: function () {
      var _addShippingMethod_ = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(shippingLine, orderId) {
        var _this6 = this;

        var soId;
        return regeneratorRuntime.wrap(function _callee13$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                soId = "so_01FHDK9JQ1PKBAK16AW01H8JBS"; //temp

                return _context16.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(manager) {
                    return regeneratorRuntime.wrap(function _callee12$(_context15) {
                      while (1) {
                        switch (_context15.prev = _context15.next) {
                          case 0:
                            _context15.next = 2;
                            return _this6.orderService_.withTransaction(manager).addShippingMethod(orderId, soId, {}, {
                              price: (0, _parsePrice.parsePrice)(shippingLine.price)
                            });

                          case 2:
                            return _context15.abrupt("return", Promise.resolve());

                          case 3:
                          case "end":
                            return _context15.stop();
                        }
                      }
                    }, _callee12);
                  }));

                  return function (_x14) {
                    return _ref6.apply(this, arguments);
                  };
                }()));

              case 2:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee13, this);
      }));

      function addShippingMethod_(_x12, _x13) {
        return _addShippingMethod_.apply(this, arguments);
      }

      return addShippingMethod_;
    }()
  }, {
    key: "getRegion_",
    value: function () {
      var _getRegion_ = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(countryCode) {
        return regeneratorRuntime.wrap(function _callee14$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.prev = 0;
                _context17.next = 3;
                return this.regionService_.retrieveByCountryCode(countryCode.toLowerCase());

              case 3:
                return _context17.abrupt("return", _context17.sent);

              case 6:
                _context17.prev = 6;
                _context17.t0 = _context17["catch"](0);
                return _context17.abrupt("return", null);

              case 9:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee14, this, [[0, 6]]);
      }));

      function getRegion_(_x15) {
        return _getRegion_.apply(this, arguments);
      }

      return getRegion_;
    }()
  }, {
    key: "getTaxRate_",
    value: function getTaxRate_(taxLines) {
      return taxLines[0].rate || 0;
    }
  }, {
    key: "normalizeOrder_",
    value: function () {
      var _normalizeOrder_ = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(shopifyOrder, customerId) {
        var _this7 = this;

        return regeneratorRuntime.wrap(function _callee16$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                return _context19.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(manager) {
                    var paymentStatus, fulfillmentStatus, region, items, _iterator7, _step7, lineItem, normalized;

                    return regeneratorRuntime.wrap(function _callee15$(_context18) {
                      while (1) {
                        switch (_context18.prev = _context18.next) {
                          case 0:
                            paymentStatus = _this7.normalizeOrderPaymentStatus_(shopifyOrder.financial_status);
                            fulfillmentStatus = _this7.normalizeOrderFulfilmentStatus_(shopifyOrder.fulfillment_status);
                            _context18.next = 4;
                            return _this7.getRegion_(shopifyOrder.shipping_address.country_code);

                          case 4:
                            region = _context18.sent;
                            items = [];
                            _iterator7 = _createForOfIteratorHelper(shopifyOrder.line_items);
                            _context18.prev = 7;

                            _iterator7.s();

                          case 9:
                            if ((_step7 = _iterator7.n()).done) {
                              _context18.next = 17;
                              break;
                            }

                            lineItem = _step7.value;
                            _context18.next = 13;
                            return _this7.lineItemService_.withTransaction(manager).normalizeLineItem(lineItem);

                          case 13:
                            normalized = _context18.sent;
                            items.push(normalized);

                          case 15:
                            _context18.next = 9;
                            break;

                          case 17:
                            _context18.next = 22;
                            break;

                          case 19:
                            _context18.prev = 19;
                            _context18.t0 = _context18["catch"](7);

                            _iterator7.e(_context18.t0);

                          case 22:
                            _context18.prev = 22;

                            _iterator7.f();

                            return _context18.finish(22);

                          case 25:
                            return _context18.abrupt("return", {
                              status: _this7.normalizeOrderStatus_(fulfillmentStatus, paymentStatus),
                              region_id: region.id,
                              email: shopifyOrder.email,
                              customer_id: customerId,
                              currency_code: shopifyOrder.currency.toLowerCase(),
                              tax_rate: region.tax_rate,
                              tax_total: (0, _parsePrice.parsePrice)(shopifyOrder.total_tax),
                              subtotal: shopifyOrder.subtotal_price,
                              shipping_address: _this7.normalizeBilling_(shopifyOrder.shipping_address),
                              billing_address: _this7.normalizeBilling_(shopifyOrder.billing_address),
                              discount_total: shopifyOrder.total_discounts,
                              fulfilment_status: fulfillmentStatus,
                              payment_status: paymentStatus,
                              items: items,
                              external_id: shopifyOrder.id
                            });

                          case 26:
                          case "end":
                            return _context18.stop();
                        }
                      }
                    }, _callee15, null, [[7, 19, 22, 25]]);
                  }));

                  return function (_x18) {
                    return _ref7.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee16, this);
      }));

      function normalizeOrder_(_x16, _x17) {
        return _normalizeOrder_.apply(this, arguments);
      }

      return normalizeOrder_;
    }()
  }, {
    key: "normalizeOrderStatus_",
    value: function normalizeOrderStatus_(fulfillmentStatus, paymentStatus) {
      if (fulfillmentStatus === "fulfilled" && paymentStatus === "captured") {
        return "completed";
      } else {
        return "pending";
      }
    }
  }, {
    key: "normalizeOrderFulfilmentStatus_",
    value: function normalizeOrderFulfilmentStatus_(fulfilmentStatus) {
      switch (fulfilmentStatus) {
        case null:
          return "not_fulfilled";

        case "fulfilled":
          return "fulfilled";

        case "partial":
          return "partially_fulfilled";

        case "restocked":
          return "returned";

        case "pending":
          return "not_fulfilled";

        default:
          return null;
      }
    }
  }, {
    key: "normalizeOrderPaymentStatus_",
    value: function normalizeOrderPaymentStatus_(financial_status) {
      switch (financial_status) {
        case "refunded":
          return "refunded";

        case "voided":
          return "canceled";

        case "partially_refunded":
          return "partially_refunded";

        case "partially_paid":
          return "not_paid";

        case "pending":
          return "not_paid";

        case "authorized":
          return "awaiting";

        case "paid":
          return "captured";

        default:
          return null;
      }
    }
  }, {
    key: "normalizeBilling_",
    value: function normalizeBilling_(shopifyAddress) {
      return {
        first_name: shopifyAddress.first_name,
        last_name: shopifyAddress.last_name,
        phone: shopifyAddress.phone,
        company: shopifyAddress.company,
        address_1: shopifyAddress.address1,
        address_2: shopifyAddress.address2,
        city: shopifyAddress.city,
        postal_code: shopifyAddress.zip,
        country_code: shopifyAddress.country_code.toLowerCase(),
        province: shopifyAddress.province_code
      };
    }
  }]);

  return ShopifyOrderService;
}(_medusaInterfaces.BaseService);

var _default = ShopifyOrderService;
exports["default"] = _default;