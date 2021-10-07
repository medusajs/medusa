"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _medusaInterfaces = require("medusa-interfaces");

var _medusaCoreUtils = require("medusa-core-utils");

var _const = require("../utils/const");

var _errors = require("medusa-core-utils/dist/errors");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var ShopifyFulfillmentService = /*#__PURE__*/function (_BaseService) {
  _inherits(ShopifyFulfillmentService, _BaseService);

  var _super = _createSuper(ShopifyFulfillmentService);

  function ShopifyFulfillmentService(_ref, options) {
    var _this;

    var manager = _ref.manager,
        orderService = _ref.orderService,
        shopifyOrderService = _ref.shopifyOrderService,
        shopifyClientService = _ref.shopifyClientService,
        fulfillmentRepository = _ref.fulfillmentRepository,
        fulfillmentService = _ref.fulfillmentService;

    _classCallCheck(this, ShopifyFulfillmentService);

    _this = _super.call(this);
    _this.options = options;
    /** @private @const {EntityManager} */

    _this.manager_ = manager;
    /** @private @const {FulfillmentRepository} */

    _this.fulfillmentRepository_ = fulfillmentRepository;
    /** @private @const {FulfillmentService} */

    _this.fulfillmentService_ = fulfillmentService;
    /** @private @const {ShopifyOrderService} */

    _this.shopifyOrderService_ = shopifyOrderService;
    /** @private @const {ShopifyOrderService} */

    _this.orderService_ = orderService;
    /** @private @const {ShopifyRestClient} */

    _this.client_ = shopifyClientService;
    return _this;
  }

  _createClass(ShopifyFulfillmentService, [{
    key: "withTransaction",
    value: function withTransaction(transactionManager) {
      if (!transactionManager) {
        return this;
      }

      var cloned = new ShopifyFulfillmentService({
        manager: transactionManager,
        options: this.options,
        orderService: this.orderService_,
        shopifyClientService: this.client_,
        shopifyOrderService: this.shopifyOrderService_,
        fulfillmentRepository: this.fulfillmentRepository_,
        fulfillmentService: this.fulfillmentService_
      });
      cloned.transactionManager_ = transactionManager;
      return cloned;
    }
    /**
     * Creates a fulfillment based on an event from Shopify.
     * @param {object} data
     * @returns {Fulfillment}
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
                    var id, order_id, line_items, tracking_number, tracking_numbers, tracking_url, tracking_urls, order, shopifyOrder, fulfillmentExists, itemsToFulfill;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            id = data.id, order_id = data.order_id, line_items = data.line_items, tracking_number = data.tracking_number, tracking_numbers = data.tracking_numbers, tracking_url = data.tracking_url, tracking_urls = data.tracking_urls;
                            _context.next = 3;
                            return _this2.shopifyOrderService_.retrieve(order_id, {
                              relations: ["items", "fulfillments"]
                            })["catch"](function (_) {
                              return undefined;
                            });

                          case 3:
                            order = _context.sent;

                            if (order) {
                              _context.next = 9;
                              break;
                            }

                            shopifyOrder = _this2.client_.get({
                              path: "orders/".concat(order_id),
                              extraHeaders: _const.INCLUDE_PRESENTMENT_PRICES
                            });
                            _context.next = 8;
                            return _this2.shopifyOrderService_.withTransaction(manager).create(shopifyOrder);

                          case 8:
                            order = _context.sent;

                          case 9:
                            fulfillmentExists = order.fulfillments.find(function (f) {
                              return f.metadata.sh_id === id;
                            });

                            if (!fulfillmentExists) {
                              _context.next = 12;
                              break;
                            }

                            return _context.abrupt("return", Promise.resolve());

                          case 12:
                            itemsToFulfill = line_items.map(function (l) {
                              var match = order.items.find(function (i) {
                                return i.variant.sku === l.sku;
                              });

                              if (!match) {
                                throw new _medusaCoreUtils.MedusaError(_medusaCoreUtils.MedusaError.Types.INVALID_DATA, "Error on line item ".concat(l.id, ". Missing SKU. Product variants are required to have a SKU code."));
                              }

                              return {
                                item_id: match.id,
                                quantity: l.quantity
                              };
                            });
                            _context.next = 15;
                            return _this2.orderService_.withTransaction(manager).createFulfillment(order.id, itemsToFulfill, {
                              metadata: {
                                sh_id: id,
                                tracking_number: tracking_number,
                                tracking_numbers: tracking_numbers,
                                tracking_url: tracking_url,
                                tracking_urls: tracking_urls
                              }
                            });

                          case 15:
                            return _context.abrupt("return", _context.sent);

                          case 16:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
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
     * Updates a fulfillment based on an event from Shopify
     * @returns {Fulfillment}
     */

  }, {
    key: "update",
    value: function () {
      var _update = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(data) {
        var _this3 = this;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(manager) {
                    var id, order_id, status, tracking_number, tracking_numbers, tracking_url, tracking_urls, order, shopifyOrder, fulfillment, trackingInfo, fulfillmentRepository, result;
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            id = data.id, order_id = data.order_id, status = data.status, tracking_number = data.tracking_number, tracking_numbers = data.tracking_numbers, tracking_url = data.tracking_url, tracking_urls = data.tracking_urls;
                            _context3.next = 3;
                            return _this3.shopifyOrderService_.retrieve(order_id, {
                              relations: ["fulfillments", "items"]
                            })["catch"](function (_) {
                              return undefined;
                            });

                          case 3:
                            order = _context3.sent;

                            if (order) {
                              _context3.next = 9;
                              break;
                            }

                            shopifyOrder = _this3.client_.get({
                              path: "orders/".concat(order_id),
                              extraHeaders: _const.INCLUDE_PRESENTMENT_PRICES
                            });
                            _context3.next = 8;
                            return _this3.shopifyOrderService_.create(shopifyOrder);

                          case 8:
                            order = _context3.sent;

                          case 9:
                            fulfillment = order.fulfillments.find(function (f) {
                              return f.metadata.sh_id === id;
                            });

                            if (fulfillment) {
                              _context3.next = 12;
                              break;
                            }

                            throw new _medusaCoreUtils.MedusaError(_medusaCoreUtils.MedusaError.Types.INVALID_DATA, "Could not retrieve any fulfillments with sh_id: ".concat(id));

                          case 12:
                            if (!(status === "cancelled")) {
                              _context3.next = 18;
                              break;
                            }

                            if (!fulfillment.cancelled_at) {
                              _context3.next = 15;
                              break;
                            }

                            return _context3.abrupt("return", Promise.resolve());

                          case 15:
                            _context3.next = 17;
                            return _this3.cancel_(fulfillment.id);

                          case 17:
                            return _context3.abrupt("return", _context3.sent);

                          case 18:
                            trackingInfo = {
                              tracking_number: tracking_number,
                              tracking_numbers: tracking_numbers,
                              tracking_url: tracking_url,
                              tracking_urls: tracking_urls
                            };
                            fulfillmentRepository = manager.getCustomRepository(_this3.fulfillmentRepository_);
                            fulfillment.metadata = _objectSpread(_objectSpread({}, fulfillment.metadata), trackingInfo);
                            _context3.next = 23;
                            return fulfillmentRepository.save(fulfillment);

                          case 23:
                            result = _context3.sent;
                            return _context3.abrupt("return", result);

                          case 25:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));

                  return function (_x4) {
                    return _ref3.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context4.stop();
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
     * Cancels a fulfillment
     * @param {string} fulfillmentId
     * @returns {Promise}
     */

  }, {
    key: "cancel_",
    value: function () {
      var _cancel_ = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(fulfillmentId) {
        var _this4 = this;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(manager) {
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            _context5.next = 2;
                            return _this4.orderService_.withTransaction(manager).cancelFulfillment(fulfillmentId);

                          case 2:
                            return _context5.abrupt("return", Promise.resolve());

                          case 3:
                          case "end":
                            return _context5.stop();
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
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function cancel_(_x5) {
        return _cancel_.apply(this, arguments);
      }

      return cancel_;
    }()
  }, {
    key: "addShopifyId",
    value: function () {
      var _addShopifyId = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(fulfillmentId, shopifyId) {
        var _this5 = this;

        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(manager) {
                    var fulfillmentRepository, fulfillment, result;
                    return regeneratorRuntime.wrap(function _callee7$(_context7) {
                      while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            fulfillmentRepository = manager.getCustomRepository(_this5.fulfillmentRepository_);
                            _context7.next = 3;
                            return _this5.fulfillmentService_.retrieve(fulfillmentId);

                          case 3:
                            fulfillment = _context7.sent;
                            fulfillment.metadata = _objectSpread(_objectSpread({}, fulfillment.metadata), {}, {
                              sh_id: shopifyId
                            });
                            _context7.next = 7;
                            return fulfillmentRepository.save(fulfillment);

                          case 7:
                            result = _context7.sent;
                            return _context7.abrupt("return", result);

                          case 9:
                          case "end":
                            return _context7.stop();
                        }
                      }
                    }, _callee7);
                  }));

                  return function (_x9) {
                    return _ref5.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function addShopifyId(_x7, _x8) {
        return _addShopifyId.apply(this, arguments);
      }

      return addShopifyId;
    }()
  }]);

  return ShopifyFulfillmentService;
}(_medusaInterfaces.BaseService);

var _default = ShopifyFulfillmentService;
exports["default"] = _default;