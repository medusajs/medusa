"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _axios = _interopRequireDefault(require("axios"));

var _medusaInterfaces = require("medusa-interfaces");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) {
  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  return function () {
    var Super = _getPrototypeOf(Derived),
        result;

    if (isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var KlarnaProviderService =
/*#__PURE__*/
function (_PaymentService) {
  _inherits(KlarnaProviderService, _PaymentService);

  var _super = _createSuper(KlarnaProviderService);

  function KlarnaProviderService(_ref, options) {
    var _this;

    var shippingProfileService = _ref.shippingProfileService,
        totalsService = _ref.totalsService,
        regionService = _ref.regionService;

    _classCallCheck(this, KlarnaProviderService);

    _this = _super.call(this);
    _this.options_ = options;
    _this.klarna_ = _axios["default"].create({
      baseURL: options.url,
      auth: {
        username: options.user,
        password: options.password
      }
    });
    _this.klarnaOrderUrl_ = "/checkout/v3/orders";
    _this.klarnaOrderManagementUrl_ = "/ordermanagement/v1/orders";
    _this.backendUrl_ = process.env.BACKEND_URL || "https://c8e1abe7d8b3.ngrok.io";
    _this.totalsService_ = totalsService;
    _this.regionService_ = regionService;
    _this.shippingProfileService_ = shippingProfileService;
    return _this;
  }

  _createClass(KlarnaProviderService, [{
    key: "lineItemsToOrderLines_",
    value: function () {
      var _lineItemsToOrderLines_ = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(cart, taxRate) {
        var order_lines, _cart$shipping_method, name, price;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                order_lines = [];
                cart.items.forEach(function (item) {
                  // For bundles, we create an order line for each item in the bundle
                  if (Array.isArray(item.content)) {
                    item.content.forEach(function (c) {
                      var total_amount = c.unit_price * c.quantity * (taxRate + 1);
                      var total_tax_amount = total_amount * taxRate;
                      order_lines.push({
                        name: item.title,
                        unit_price: c.unit_price,
                        quantity: c.quantity,
                        tax_rate: taxRate * 10000,
                        total_amount: total_amount,
                        total_tax_amount: total_tax_amount
                      });
                    });
                  } else {
                    // Withdraw discount from the total item amount
                    var quantity = item.quantity;
                    var unit_price = item.content.unit_price * 100 * (taxRate + 1);
                    var total_amount = unit_price * quantity;
                    var total_tax_amount = total_amount * (taxRate / (1 + taxRate));
                    order_lines.push({
                      name: item.title,
                      tax_rate: taxRate * 10000,
                      quantity: quantity,
                      unit_price: unit_price,
                      total_amount: total_amount,
                      total_tax_amount: total_tax_amount
                    });
                  }
                });

                if (cart.shipping_methods.length) {
                  _cart$shipping_method = cart.shipping_methods.reduce(function (acc, next) {
                    acc.name = [].concat(_toConsumableArray(acc.name), [next.name]);
                    acc.price += next.price;
                    return acc;
                  }, {
                    name: [],
                    price: 0
                  }), name = _cart$shipping_method.name, price = _cart$shipping_method.price;
                  order_lines.push({
                    name: name.join(" + "),
                    quantity: 1,
                    type: "shipping_fee",
                    unit_price: price * (1 + taxRate) * 100,
                    tax_rate: taxRate * 10000,
                    total_amount: price * (1 + taxRate) * 100,
                    total_tax_amount: price * taxRate * 100
                  });
                }

                return _context.abrupt("return", order_lines);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function lineItemsToOrderLines_(_x, _x2) {
        return _lineItemsToOrderLines_.apply(this, arguments);
      }

      return lineItemsToOrderLines_;
    }()
  }, {
    key: "cartToKlarnaOrder",
    value: function () {
      var _cartToKlarnaOrder = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(cart) {
        var order, _ref2, tax_rate, currency_code, discount, shippingOptions, shipping_method, partitioned, f, cartesian, methods, combinations;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                order = {
                  // Cart id is stored, such that we can use it for hooks
                  merchant_data: cart._id,
                  // TODO: Investigate if other locales are needed
                  locale: "en-US"
                };
                _context2.next = 3;
                return this.regionService_.retrieve(cart.region_id);

              case 3:
                _ref2 = _context2.sent;
                tax_rate = _ref2.tax_rate;
                currency_code = _ref2.currency_code;
                _context2.next = 8;
                return this.lineItemsToOrderLines_(cart, tax_rate);

              case 8:
                order.order_lines = _context2.sent;
                _context2.next = 11;
                return this.totalsService_.getDiscountTotal(cart);

              case 11:
                _context2.t0 = _context2.sent;
                discount = _context2.t0 * 100;

                if (discount) {
                  order.order_lines.push({
                    name: "Discount",
                    quantity: 1,
                    type: "discount",
                    unit_price: 0,
                    total_discount_amount: discount * (1 + tax_rate),
                    tax_rate: tax_rate * 10000,
                    total_amount: -discount * (1 + tax_rate),
                    total_tax_amount: -discount * tax_rate
                  });
                }

                if (!_lodash["default"].isEmpty(cart.billing_address)) {
                  order.billing_address = {
                    email: cart.email,
                    street_address: cart.billing_address.address_1,
                    street_address2: cart.billing_address.address_2,
                    postal_code: cart.billing_address.postal_code,
                    city: cart.billing_address.city,
                    country: cart.billing_address.country_code
                  };
                } // TODO: Check if country matches ISO


                if (!_lodash["default"].isEmpty(cart.billing_address) && cart.billing_address.country) {
                  order.purchase_country = cart.billing_address.country;
                } else {
                  // Defaults to Sweden
                  order.purchase_country = "SE";
                }

                _context2.next = 18;
                return this.totalsService_.getTotal(cart);

              case 18:
                _context2.t1 = _context2.sent;
                order.order_amount = _context2.t1 * 100;
                _context2.next = 22;
                return this.totalsService_.getTaxTotal(cart);

              case 22:
                _context2.t2 = _context2.sent;
                order.order_tax_amount = _context2.t2 * 100;
                // TODO: Check if currency matches ISO
                order.purchase_currency = currency_code;
                order.merchant_urls = {
                  terms: this.options_.merchant_urls.terms,
                  checkout: this.options_.merchant_urls.checkout,
                  confirmation: this.options_.merchant_urls.confirmation,
                  push: "".concat(this.backendUrl_, "/klarna/push?klarna_order_id={checkout.order.id}"),
                  shipping_option_update: "".concat(this.backendUrl_, "/klarna/shipping"),
                  address_update: "".concat(this.backendUrl_, "/klarna/address")
                };

                if (!(cart.shipping_address && cart.shipping_address.first_name)) {
                  _context2.next = 37;
                  break;
                }

                _context2.next = 29;
                return this.shippingProfileService_.fetchCartOptions(cart);

              case 29:
                shippingOptions = _context2.sent;

                // If the cart does not have shipping methods yet, preselect one from
                // shipping_options and set the selected shipping method
                if (cart.shipping_methods.length) {
                  shipping_method = cart.shipping_methods[0];
                  order.selected_shipping_option = {
                    id: shipping_method._id,
                    name: shipping_method.name,
                    price: shipping_method.price * (1 + tax_rate) * 100,
                    tax_amount: shipping_method.price * tax_rate * 100,
                    tax_rate: tax_rate * 10000
                  };
                }

                partitioned = shippingOptions.reduce(function (acc, next) {
                  if (acc[next.profile_id]) {
                    acc[next.profile_id] = [].concat(_toConsumableArray(acc[next.profile_id]), [next]);
                  } else {
                    acc[next.profile_id] = [next];
                  }

                  return acc;
                }, {});

                f = function f(a, b) {
                  var _ref3;

                  return (_ref3 = []).concat.apply(_ref3, _toConsumableArray(a.map(function (a) {
                    return b.map(function (b) {
                      return [].concat(a, b);
                    });
                  })));
                };

                cartesian = function cartesian(a, b) {
                  for (var _len = arguments.length, c = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                    c[_key - 2] = arguments[_key];
                  }

                  return b ? cartesian.apply(void 0, [f(a, b)].concat(c)) : a;
                };

                methods = Object.keys(partitioned).map(function (k) {
                  return partitioned[k];
                });
                combinations = cartesian.apply(void 0, _toConsumableArray(methods));
                order.shipping_options = combinations.map(function (combination) {
                  combination = Array.isArray(combination) ? combination : [combination];
                  var details = combination.reduce(function (acc, next) {
                    acc.id = [].concat(_toConsumableArray(acc.id), [next._id]);
                    acc.name = [].concat(_toConsumableArray(acc.name), [next.name]);
                    acc.price += next.price;
                    return acc;
                  }, {
                    id: [],
                    name: [],
                    price: 0
                  });
                  return {
                    id: details.id.join("."),
                    name: details.name.join(" + "),
                    price: details.price * (1 + tax_rate) * 100,
                    tax_amount: details.price * tax_rate * 100,
                    tax_rate: tax_rate * 10000,
                    preselected: combinations.length === 1
                  };
                });

              case 37:
                return _context2.abrupt("return", order);

              case 38:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function cartToKlarnaOrder(_x3) {
        return _cartToKlarnaOrder.apply(this, arguments);
      }

      return cartToKlarnaOrder;
    }()
    /**
     * Status for Klarna order.
     * @param {Object} paymentData - payment method data from cart
     * @returns {string} the status of the Klarna order
     */

  }, {
    key: "getStatus",
    value: function () {
      var _getStatus = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(paymentData) {
        var order_id, _ref4, order, status;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                order_id = paymentData.order_id;
                _context3.next = 4;
                return this.klarna_.get("".concat(this.klarnaOrderUrl_, "/").concat(order_id));

              case 4:
                _ref4 = _context3.sent;
                order = _ref4.data;
                status = "initial";

                if (order.status === "checkout_complete") {
                  status = "authorized";
                }

                return _context3.abrupt("return", status);

              case 11:
                _context3.prev = 11;
                _context3.t0 = _context3["catch"](0);
                throw _context3.t0;

              case 14:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 11]]);
      }));

      function getStatus(_x4) {
        return _getStatus.apply(this, arguments);
      }

      return getStatus;
    }()
    /**
     * Creates Stripe PaymentIntent.
     * @param {string} cart - the cart to create a payment for
     * @param {number} amount - the amount to create a payment for
     * @returns {string} id of payment intent
     */

  }, {
    key: "createPayment",
    value: function () {
      var _createPayment = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(cart) {
        var order;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return this.cartToKlarnaOrder(cart);

              case 3:
                order = _context4.sent;
                return _context4.abrupt("return", this.klarna_.post(this.klarnaOrderUrl_, order).then(function (_ref5) {
                  var data = _ref5.data;
                  return data;
                }));

              case 7:
                _context4.prev = 7;
                _context4.t0 = _context4["catch"](0);
                throw _context4.t0;

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 7]]);
      }));

      function createPayment(_x5) {
        return _createPayment.apply(this, arguments);
      }

      return createPayment;
    }()
    /**
     * Retrieves Klarna Order.
     * @param {string} cart - the cart to retrieve order for
     * @returns {Object} Klarna order
     */

  }, {
    key: "retrievePayment",
    value: function () {
      var _retrievePayment = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(paymentData) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                return _context5.abrupt("return", this.klarna_.get("".concat(this.klarnaOrderUrl_, "/").concat(paymentData.order_id)).then(function (_ref6) {
                  var data = _ref6.data;
                  return data;
                }));

              case 4:
                _context5.prev = 4;
                _context5.t0 = _context5["catch"](0);
                throw _context5.t0;

              case 7:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 4]]);
      }));

      function retrievePayment(_x6) {
        return _retrievePayment.apply(this, arguments);
      }

      return retrievePayment;
    }()
    /**
     * Retrieves completed Klarna Order.
     * @param {string} klarnaOrderId - id of the order to retrieve
     * @returns {Object} Klarna order
     */

  }, {
    key: "retrieveCompletedOrder",
    value: function () {
      var _retrieveCompletedOrder = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6(klarnaOrderId) {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                return _context6.abrupt("return", this.klarna_.get("".concat(this.klarnaOrderManagementUrl_, "/").concat(klarnaOrderId)));

              case 4:
                _context6.prev = 4;
                _context6.t0 = _context6["catch"](0);
                throw _context6.t0;

              case 7:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 4]]);
      }));

      function retrieveCompletedOrder(_x7) {
        return _retrieveCompletedOrder.apply(this, arguments);
      }

      return retrieveCompletedOrder;
    }()
    /**
     * Acknowledges a Klarna order as part of the order completion process
     * @param {string} klarnaOrderId - id of the order to acknowledge
     * @returns {string} id of acknowledged order
     */

  }, {
    key: "acknowledgeOrder",
    value: function () {
      var _acknowledgeOrder = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee7(klarnaOrderId, orderId) {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return this.klarna_.post("".concat(this.klarnaOrderManagementUrl_, "/").concat(klarnaOrderId, "/acknowledge"));

              case 3:
                _context7.next = 5;
                return this.klarna_.patch("".concat(this.klarnaOrderManagementUrl_, "/").concat(klarnaOrderId, "/merchant-references"), {
                  merchant_reference1: orderId
                });

              case 5:
                return _context7.abrupt("return", klarnaOrderId);

              case 8:
                _context7.prev = 8;
                _context7.t0 = _context7["catch"](0);
                throw _context7.t0;

              case 11:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[0, 8]]);
      }));

      function acknowledgeOrder(_x8, _x9) {
        return _acknowledgeOrder.apply(this, arguments);
      }

      return acknowledgeOrder;
    }()
    /**
     * Adds the id of the Medusa order to the Klarna Order to create a relation
     * @param {string} klarnaOrderId - id of the klarna order
     * @param {string} orderId - id of the Medusa order
     * @returns {string} id of updated order
     */

  }, {
    key: "addOrderToKlarnaOrder",
    value: function () {
      var _addOrderToKlarnaOrder = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee8(klarnaOrderId, orderId) {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;
                _context8.next = 3;
                return this.klarna_.post("".concat(this.klarnaOrderManagementUrl_, "/").concat(klarnaOrderId, "/merchant-references"), {
                  merchant_reference1: orderId
                });

              case 3:
                return _context8.abrupt("return", klarnaOrderId);

              case 6:
                _context8.prev = 6;
                _context8.t0 = _context8["catch"](0);
                throw _context8.t0;

              case 9:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[0, 6]]);
      }));

      function addOrderToKlarnaOrder(_x10, _x11) {
        return _addOrderToKlarnaOrder.apply(this, arguments);
      }

      return addOrderToKlarnaOrder;
    }()
    /**
     * Updates Klarna order.
     * @param {string} order - the order to update
     * @param {Object} data - the update object
     * @returns {Object} updated order
     */

  }, {
    key: "updatePayment",
    value: function () {
      var _updatePayment = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee9(paymentData, cart) {
        var order;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;
                _context9.next = 3;
                return this.cartToKlarnaOrder(cart, true);

              case 3:
                order = _context9.sent;
                return _context9.abrupt("return", this.klarna_.post("".concat(this.klarnaOrderUrl_, "/").concat(paymentData.order_id), order).then(function (_ref7) {
                  var data = _ref7.data;
                  return data;
                }));

              case 7:
                _context9.prev = 7;
                _context9.t0 = _context9["catch"](0);
                throw _context9.t0;

              case 10:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this, [[0, 7]]);
      }));

      function updatePayment(_x12, _x13) {
        return _updatePayment.apply(this, arguments);
      }

      return updatePayment;
    }()
    /**
     * Captures Klarna order.
     * @param {Object} paymentData - payment method data from cart
     * @returns {string} id of captured order
     */

  }, {
    key: "capturePayment",
    value: function () {
      var _capturePayment = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee10(paymentData) {
        var order_id, orderData, order_amount;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                order_id = paymentData.order_id;
                _context10.next = 4;
                return this.klarna_.get("".concat(this.klarnaOrderUrl_, "/").concat(order_id));

              case 4:
                orderData = _context10.sent;
                order_amount = orderData.order.order_amount;
                _context10.next = 8;
                return this.klarna_.post("".concat(this.klarnaOrderManagementUrl_, "/").concat(order_id, "/captures"), {
                  captured_amount: order_amount
                });

              case 8:
                return _context10.abrupt("return", order_id);

              case 11:
                _context10.prev = 11;
                _context10.t0 = _context10["catch"](0);
                throw _context10.t0;

              case 14:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this, [[0, 11]]);
      }));

      function capturePayment(_x14) {
        return _capturePayment.apply(this, arguments);
      }

      return capturePayment;
    }()
    /**
     * Refunds payment for Klarna Order.
     * @param {Object} paymentData - payment method data from cart
     * @returns {string} id of refunded order
     */

  }, {
    key: "refundPayment",
    value: function () {
      var _refundPayment = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee11(paymentData, amount) {
        var order_id;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;
                order_id = paymentData.order_id;
                _context11.next = 4;
                return this.klarna_.post("".concat(this.klarnaOrderManagementUrl_, "/").concat(order_id, "/refunds"), {
                  refunded_amount: amount
                });

              case 4:
                return _context11.abrupt("return", order_id);

              case 7:
                _context11.prev = 7;
                _context11.t0 = _context11["catch"](0);
                throw _context11.t0;

              case 10:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this, [[0, 7]]);
      }));

      function refundPayment(_x15, _x16) {
        return _refundPayment.apply(this, arguments);
      }

      return refundPayment;
    }()
    /**
     * Cancels payment for Klarna Order.
     * @param {Object} paymentData - payment method data from cart
     * @returns {string} id of cancelled order
     */

  }, {
    key: "cancelPayment",
    value: function () {
      var _cancelPayment = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee12(paymentData) {
        var order_id;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.prev = 0;
                order_id = paymentData.order_id;
                _context12.next = 4;
                return this.klarna_.post("".concat(this.klarnaOrderUrl_, "/").concat(order_id, "/cancel"));

              case 4:
                return _context12.abrupt("return", order_id);

              case 7:
                _context12.prev = 7;
                _context12.t0 = _context12["catch"](0);
                throw _context12.t0;

              case 10:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this, [[0, 7]]);
      }));

      function cancelPayment(_x17) {
        return _cancelPayment.apply(this, arguments);
      }

      return cancelPayment;
    }()
  }]);

  return KlarnaProviderService;
}(_medusaInterfaces.PaymentService);

_defineProperty(KlarnaProviderService, "identifier", "klarna");

var _default = KlarnaProviderService;
exports["default"] = _default;