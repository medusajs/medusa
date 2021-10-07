"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _medusaInterfaces = require("medusa-interfaces");

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

var ShopifyCustomerService = /*#__PURE__*/function (_BaseService) {
  _inherits(ShopifyCustomerService, _BaseService);

  var _super = _createSuper(ShopifyCustomerService);

  function ShopifyCustomerService(_ref, options) {
    var _this;

    var manager = _ref.manager,
        customerService = _ref.customerService;

    _classCallCheck(this, ShopifyCustomerService);

    _this = _super.call(this);
    _this.options = options;
    /** @private @const {EntityManager} */

    _this.manager_ = manager;
    /** @private @const {CustomerService} */

    _this.customerService_ = customerService;
    return _this;
  }

  _createClass(ShopifyCustomerService, [{
    key: "withTransaction",
    value: function withTransaction(transactionManager) {
      if (!transactionManager) {
        return this;
      }

      var cloned = new ShopifyCustomerService({
        manager: transactionManager,
        options: this.options,
        customerService: this.customerService_
      });
      cloned.transactionManager_ = transactionManager;
      return cloned;
    }
    /**
     * Creates a new customer
     * @param {object} customer
     * @param {object} shippingAddress
     * @param {object} billingAddress
     * @returns
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
                    var customer, shipping_address, billing_address, existingCustomer, normalizedCustomer, normalizedBilling, normalizedShipping, medusaCustomer, result;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            customer = data.customer, shipping_address = data.shipping_address, billing_address = data.billing_address;
                            _context.next = 3;
                            return _this2.customerService_.retrieveByEmail(customer.email)["catch"](function (_err) {
                              return undefined;
                            });

                          case 3:
                            existingCustomer = _context.sent;

                            if (!existingCustomer) {
                              _context.next = 6;
                              break;
                            }

                            return _context.abrupt("return", existingCustomer);

                          case 6:
                            normalizedCustomer = _this2.normalizeCustomer_(customer, shipping_address, billing_address);
                            normalizedBilling = normalizedCustomer.billing_address;
                            normalizedShipping = normalizedCustomer.shipping_address;
                            delete normalizedCustomer.billing_address;
                            delete normalizedCustomer.shipping_address;
                            _context.next = 13;
                            return _this2.customerService_.withTransaction(manager).create(normalizedCustomer);

                          case 13:
                            medusaCustomer = _context.sent;
                            _context.next = 16;
                            return _this2.customerService_.withTransaction(manager).addAddress(medusaCustomer.id, normalizedShipping)["catch"](function (e) {
                              return console.log("Failed on creating shipping address", e, normalizedShipping);
                            });

                          case 16:
                            _context.next = 18;
                            return _this2.customerService_.withTransaction(manager).update(medusaCustomer.id, {
                              billing_address: normalizedBilling
                            })["catch"](function (e) {
                              return console.log("Failed on creating billing address", e, normalizedBilling);
                            });

                          case 18:
                            result = _context.sent;
                            return _context.abrupt("return", result);

                          case 20:
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
  }, {
    key: "normalizeAddress_",
    value: function normalizeAddress_(shopifyAddress) {
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
  }, {
    key: "normalizeCustomer_",
    value: function normalizeCustomer_(shopifyCustomer, shippingAddress, billingAddress) {
      return {
        first_name: shopifyCustomer.first_name,
        last_name: shopifyCustomer.last_name,
        email: shopifyCustomer.email,
        phone: shopifyCustomer.phone,
        shipping_address: this.normalizeAddress_(shippingAddress),
        billing_address: this.normalizeAddress_(billingAddress),
        metadata: {
          sh_id: shopifyCustomer.id
        }
      };
    }
  }]);

  return ShopifyCustomerService;
}(_medusaInterfaces.BaseService);

var _default = ShopifyCustomerService;
exports["default"] = _default;