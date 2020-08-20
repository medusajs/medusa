"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _moment = _interopRequireDefault(require("moment"));

var _medusaInterfaces = require("medusa-interfaces");

var _medusaCoreUtils = require("medusa-core-utils");

var _euCountries = _interopRequireDefault(require("../utils/eu-countries"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ECONOMIC_BASE_URL = "https://restapi.e-conomic.com";

var EconomicService = /*#__PURE__*/function (_BaseService) {
  _inherits(EconomicService, _BaseService);

  var _super = _createSuper(EconomicService);

  /**
   * @param {Object} options - options defined in `medusa-config.js`
   *    {
   *      secret_token: "foo",
   *      agreement_token: "bar",
   *      customer_number_dk: 012
   *      customer_number_eu: 345
   *      customer_number_world: 678,
   *      unit_number: 42,
   *      payment_terms_number: 42,
   *      layout_number: 42,
   *      vatzone_number_eu: 42,
   *      vatzone_number_dk: 42,
   *      vatzone_number_world: 42,
   *      recipient_name: "Webshop customer"
   *    }
   */
  function EconomicService(_ref, options) {
    var _this;

    var orderService = _ref.orderService,
        totalsService = _ref.totalsService,
        regionService = _ref.regionService;

    _classCallCheck(this, EconomicService);

    _this = _super.call(this);
    _this.orderService_ = orderService;
    _this.totalsService_ = totalsService;
    _this.regionService_ = regionService;
    _this.options_ = options;
    _this.economic_ = _axios["default"].create({
      baseURL: ECONOMIC_BASE_URL,
      headers: {
        "X-AppSecretToken": options.secret_token,
        "X-AgreementGrantToken": options.agreement_token,
        "Content-Type": "application/json"
      }
    });
    return _this;
  }

  _createClass(EconomicService, [{
    key: "decideCustomerAndVatNumber_",
    value: function decideCustomerAndVatNumber_(country_code) {
      var upperCased = country_code.toUpperCase();

      if (_euCountries["default"].includes(upperCased)) {
        return {
          vat: this.options_.vatzone_number_eu,
          customer: this.options_.customer_number_eu
        };
      }

      if (upperCased === "DK") {
        return {
          vat: this.options_.vatzone_number_dk,
          customer: this.options_.customer_number_dk
        };
      }

      return {
        vat: this.options_.vatzone_number_world,
        customer: this.options_.customer_number_world
      };
    }
  }, {
    key: "createEconomicLinesFromOrder",
    value: function () {
      var _createEconomicLinesFromOrder = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(order) {
        var _this2 = this;

        var order_lines, discount, itemDiscounts;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                order_lines = []; // Find the discount, that is not free shipping

                discount = order.discounts.find(function (_ref2) {
                  var discount_rule = _ref2.discount_rule;
                  return discount_rule.type !== "free_shipping";
                }); // If the discount has an item specific allocation method,
                // we need to fetch the discount for each item

                itemDiscounts = [];

                if (!discount) {
                  _context.next = 7;
                  break;
                }

                _context.next = 6;
                return this.totalsService_.getAllocationItemDiscounts(discount, order);

              case 6:
                itemDiscounts = _context.sent;

              case 7:
                order.items.forEach(function (item) {
                  // For bundles, we create an order line for each item in the bundle
                  if (Array.isArray(item.content)) {
                    item.content.forEach(function (c) {
                      var total_amount = c.unit_price * c.quantity * (taxRate + 1);
                      order_lines.push({
                        lineNumber: order_lines.length + 1,
                        sortKey: 1,
                        unit: {
                          unitNumber: _this2.options_.unit_number
                        },
                        product: {
                          productNumber: c.product.sku
                        },
                        quantity: c.quantity,
                        // Do we include taxes on this bad boy?
                        unitNetPrice: total_amount
                      });
                    });
                  } else {
                    var total_amount = item.content.unit_price * item.content.quantity; // Find the discount for current item and default to 0

                    var itemDiscount = itemDiscounts && itemDiscounts.find(function (el) {
                      return el.lineItem._id === item._id;
                    }) || 0; // Withdraw discount from the total item amount

                    var total_discount_amount = total_amount - itemDiscount;
                    order_lines.push({
                      lineNumber: order_lines.length + 1,
                      sortKey: 1,
                      unit: {
                        unitNumber: _this2.options_.unit_number
                      },
                      product: {
                        productNumber: item.content.product.sku
                      },
                      quantity: item.content.quantity,
                      // Do we include taxes on this bad boy?
                      unitNetPrice: total_discount_amount
                    });
                  }
                });

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function createEconomicLinesFromOrder(_x) {
        return _createEconomicLinesFromOrder.apply(this, arguments);
      }

      return createEconomicLinesFromOrder;
    }()
  }, {
    key: "createInvoiceFromOrder",
    value: function () {
      var _createInvoiceFromOrder = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(order) {
        var _yield$this$regionSer, currency_code, vatZoneAndCustomer, lines;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.regionService_.retrieve(order.region_id);

              case 2:
                _yield$this$regionSer = _context2.sent;
                currency_code = _yield$this$regionSer.currency_code;
                vatZoneAndCustomer = this.decideCustomerAndVatNumber_(order.billing_address.country_code);
                _context2.next = 7;
                return this.createEconomicLinesFromOrder(order);

              case 7:
                lines = _context2.sent;
                return _context2.abrupt("return", {
                  date: (0, _moment["default"])().format("YYYY-MM-DD"),
                  currency: currency_code,
                  paymentTerms: {
                    paymentTermsNumber: this.options_.payment_terms_number
                  },
                  references: {
                    other: order._id
                  },
                  customer: {
                    customerNumber: vatZoneAndCustomer.customer
                  },
                  recipient: {
                    name: this.options_.recipient_name,
                    vatZone: {
                      vatZoneNumber: vatZoneAndCustomer.vat
                    }
                  },
                  layout: {
                    layoutNumber: this.options_.layout_number
                  },
                  lines: lines
                });

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function createInvoiceFromOrder(_x2) {
        return _createInvoiceFromOrder.apply(this, arguments);
      }

      return createInvoiceFromOrder;
    }()
  }, {
    key: "draftEconomicInvoice",
    value: function () {
      var _draftEconomicInvoice = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(orderId) {
        var order, invoice, draftInvoice, invoiceOrder;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.orderService_.retrieve(orderId);

              case 2:
                order = _context3.sent;
                _context3.next = 5;
                return this.createInvoiceFromOrder(order);

              case 5:
                invoice = _context3.sent;
                _context3.prev = 6;
                _context3.next = 9;
                return this.economic_.post("".concat(ECONOMIC_BASE_URL, "/invoices/drafts"), invoice);

              case 9:
                draftInvoice = _context3.sent;
                _context3.next = 12;
                return this.orderService_.setMetadata(order._id, "economicDraftId", draftInvoice.data.draftInvoiceNumber);

              case 12:
                _context3.next = 14;
                return this.orderService_.retrieve(order._id);

              case 14:
                invoiceOrder = _context3.sent;
                return _context3.abrupt("return", invoiceOrder);

              case 18:
                _context3.prev = 18;
                _context3.t0 = _context3["catch"](6);
                throw _context3.t0;

              case 21:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[6, 18]]);
      }));

      function draftEconomicInvoice(_x3) {
        return _draftEconomicInvoice.apply(this, arguments);
      }

      return draftEconomicInvoice;
    }()
  }, {
    key: "bookEconomicInvoice",
    value: function () {
      var _bookEconomicInvoice = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(orderId) {
        var order, economicDraftId, bookInvoiceRequest;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return this.orderService_.retrieve(orderId);

              case 3:
                order = _context4.sent;
                economicDraftId = order.metadata.economicDraftId;

                if (economicDraftId) {
                  _context4.next = 7;
                  break;
                }

                throw new _medusaCoreUtils.MedusaError(_medusaCoreUtils.MedusaError.Types.INVALID_ARGUMENT, "The order does not have an invoice number");

              case 7:
                bookInvoiceRequest = {
                  draftInvoice: {
                    draftInvoiceNumber: parseInt(economicDraftId)
                  }
                };
                return _context4.abrupt("return", this.economic_.post("".concat(ECONOMIC_BASE_URL, "/invoices/booked"), bookInvoiceRequest));

              case 11:
                _context4.prev = 11;
                _context4.t0 = _context4["catch"](0);
                throw _context4.t0;

              case 14:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 11]]);
      }));

      function bookEconomicInvoice(_x4) {
        return _bookEconomicInvoice.apply(this, arguments);
      }

      return bookEconomicInvoice;
    }()
  }]);

  return EconomicService;
}(_medusaInterfaces.BaseService);

var _default = EconomicService;
exports["default"] = _default;