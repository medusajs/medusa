"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _analyticsNode = _interopRequireDefault(require("analytics-node"));

var _axios = _interopRequireDefault(require("axios"));

var _medusaInterfaces = require("medusa-interfaces");

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

var SegmentService = /*#__PURE__*/function (_BaseService) {
  _inherits(SegmentService, _BaseService);

  var _super = _createSuper(SegmentService);

  /**
   * @param {Object} options - options defined in `medusa-config.js`
   *    e.g.
   *    {
   *      write_key: Segment write key given in Segment dashboard
   *    }
   */
  function SegmentService(_ref, options) {
    var _this;

    var totalsService = _ref.totalsService;

    _classCallCheck(this, SegmentService);

    _this = _super.call(this);
    _this.options_ = options;
    _this.totalsService_ = totalsService;
    _this.analytics_ = new _analyticsNode["default"](options.write_key);
    return _this;
  }
  /**
   * Wrapper around segment's identify call
   */


  _createClass(SegmentService, [{
    key: "identify",
    value: function identify(data) {
      return this.analytics_.identify(data);
    }
  }, {
    key: "track",
    value: function track(data) {
      return this.analytics_.track(data);
    }
  }, {
    key: "getReportingValue",
    value: function () {
      var _getReportingValue = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(fromCurrency, value) {
        var date, toCurrency, exchangeRate;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                date = "latest";
                toCurrency = this.options_.reporting_currency && this.options_.reporting_currency.toUpperCase() || "EUR";

                if (!(fromCurrency === toCurrency)) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt("return", value.toFixed(2));

              case 4:
                _context.next = 6;
                return _axios["default"].get("https://api.exchangeratesapi.io/".concat(date, "?symbols=").concat(fromCurrency, "&base=").concat(toCurrency)).then(function (_ref2) {
                  var data = _ref2.data;
                  return data.rates[fromCurrency];
                });

              case 6:
                exchangeRate = _context.sent;
                return _context.abrupt("return", (value / exchangeRate).toFixed(2));

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getReportingValue(_x, _x2) {
        return _getReportingValue.apply(this, arguments);
      }

      return getReportingValue;
    }()
  }, {
    key: "buildOrder",
    value: function () {
      var _buildOrder = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(order) {
        var _this2 = this;

        var subtotal, total, tax, discount, shipping, revenue, coupon, orderData;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.totalsService_.getSubtotal(order);

              case 2:
                subtotal = _context3.sent;
                _context3.next = 5;
                return this.totalsService_.getTotal(order);

              case 5:
                total = _context3.sent;
                _context3.next = 8;
                return this.totalsService_.getTaxTotal(order);

              case 8:
                tax = _context3.sent;
                _context3.next = 11;
                return this.totalsService_.getDiscountTotal(order);

              case 11:
                discount = _context3.sent;
                _context3.next = 14;
                return this.totalsService_.getShippingTotal(order);

              case 14:
                shipping = _context3.sent;
                revenue = total - tax;

                if (order.discounts && order.discounts.length) {
                  coupon = order.discounts[0].code;
                }

                _context3.t0 = order.cart_id;
                _context3.t1 = order._id;
                _context3.t2 = order.email;
                _context3.next = 22;
                return this.getReportingValue(order.currency_code, total);

              case 22:
                _context3.t3 = _context3.sent;
                _context3.next = 25;
                return this.getReportingValue(order.currency_code, subtotal);

              case 25:
                _context3.t4 = _context3.sent;
                _context3.next = 28;
                return this.getReportingValue(order.currency_code, revenue);

              case 28:
                _context3.t5 = _context3.sent;
                _context3.next = 31;
                return this.getReportingValue(order.currency_code, shipping);

              case 31:
                _context3.t6 = _context3.sent;
                _context3.next = 34;
                return this.getReportingValue(order.currency_code, tax);

              case 34:
                _context3.t7 = _context3.sent;
                _context3.next = 37;
                return this.getReportingValue(order.currency_code, discount);

              case 37:
                _context3.t8 = _context3.sent;
                _context3.t9 = total;
                _context3.t10 = subtotal;
                _context3.t11 = revenue;
                _context3.t12 = shipping;
                _context3.t13 = tax;
                _context3.t14 = discount;
                _context3.t15 = coupon;
                _context3.t16 = order.currency_code;
                _context3.next = 48;
                return Promise.all(order.items.map( /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(item) {
                    var name, variant, unit_price, line_total, revenue;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            name = item.title;
                            variant = item.description;
                            unit_price = item.content.unit_price;
                            line_total = unit_price * item.content.quantity * item.quantity;
                            _context2.next = 6;
                            return _this2.getReportingValue(order.currency_code, line_total);

                          case 6:
                            revenue = _context2.sent;
                            return _context2.abrupt("return", {
                              name: name,
                              variant: variant,
                              price: unit_price,
                              reporting_revenue: revenue,
                              product_id: "".concat(item.content.product._id),
                              sku: item.content.variant.sku,
                              quantity: item.quantity
                            });

                          case 8:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));

                  return function (_x4) {
                    return _ref3.apply(this, arguments);
                  };
                }()));

              case 48:
                _context3.t17 = _context3.sent;
                orderData = {
                  checkout_id: _context3.t0,
                  order_id: _context3.t1,
                  email: _context3.t2,
                  reporting_total: _context3.t3,
                  reporting_subtotal: _context3.t4,
                  reporting_revenue: _context3.t5,
                  reporting_shipping: _context3.t6,
                  reporting_tax: _context3.t7,
                  reporting_discount: _context3.t8,
                  total: _context3.t9,
                  subtotal: _context3.t10,
                  revenue: _context3.t11,
                  shipping: _context3.t12,
                  tax: _context3.t13,
                  discount: _context3.t14,
                  coupon: _context3.t15,
                  currency: _context3.t16,
                  products: _context3.t17
                };
                return _context3.abrupt("return", orderData);

              case 51:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function buildOrder(_x3) {
        return _buildOrder.apply(this, arguments);
      }

      return buildOrder;
    }()
  }]);

  return SegmentService;
}(_medusaInterfaces.BaseService);

var _default = SegmentService;
exports["default"] = _default;