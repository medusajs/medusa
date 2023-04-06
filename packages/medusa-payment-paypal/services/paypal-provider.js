"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _medusaCoreUtils = require("medusa-core-utils");

var _checkoutServerSdk = _interopRequireDefault(require("@paypal/checkout-server-sdk"));

var _medusaInterfaces = require("medusa-interfaces");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && _instanceof(outerFn.prototype, Generator) ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function roundToTwo(num, currency) {
  if (_medusaCoreUtils.zeroDecimalCurrencies.includes(currency.toLowerCase())) {
    return "".concat(num);
  }

  return num.toFixed(2);
}

var PayPalProviderService = /*#__PURE__*/function (_PaymentService) {
  _inherits(PayPalProviderService, _PaymentService);

  var _super = _createSuper(PayPalProviderService);

  function PayPalProviderService(_ref, options) {
    var _this;

    var regionService = _ref.regionService;

    _classCallCheck(this, PayPalProviderService);

    _this = _super.call(this);
    /**
     * Required PayPal options:
     *  {
     *    sandbox: [default: false],
     *    client_id: "CLIENT_ID", REQUIRED
     *    client_secret: "CLIENT_SECRET", REQUIRED
     *    auth_webhook_id: REQUIRED for webhook to work
     *  }
     */

    _this.options_ = options;
    var environment;

    if (_this.options_.sandbox) {
      environment = new _checkoutServerSdk["default"].core.SandboxEnvironment(options.client_id, options.client_secret);
    } else {
      environment = new _checkoutServerSdk["default"].core.LiveEnvironment(options.client_id, options.client_secret);
    }
    /** @private @const {PayPalHttpClient} */


    _this.paypal_ = new _checkoutServerSdk["default"].core.PayPalHttpClient(environment);
    /** @private @const {RegionService} */

    _this.regionService_ = regionService;
    return _this;
  }
  /**
   * Fetches an open PayPal order and maps its status to Medusa payment
   * statuses.
   * @param {object} paymentData - the data stored with the payment
   * @returns {Promise<string>} the status of the order
   */


  _createClass(PayPalProviderService, [{
    key: "getStatus",
    value: function () {
      var _getStatus = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(paymentData) {
        var order, status;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.retrievePayment(paymentData);

              case 2:
                order = _context.sent;
                status = "pending";
                _context.t0 = order.status;
                _context.next = _context.t0 === "CREATED" ? 7 : _context.t0 === "COMPLETED" ? 8 : _context.t0 === "SAVED" ? 9 : _context.t0 === "APPROVED" ? 9 : _context.t0 === "PAYER_ACTION_REQUIRED" ? 9 : _context.t0 === "VOIDED" ? 10 : 11;
                break;

              case 7:
                return _context.abrupt("return", "pending");

              case 8:
                return _context.abrupt("return", "authorized");

              case 9:
                return _context.abrupt("return", "requires_more");

              case 10:
                return _context.abrupt("return", "canceled");

              case 11:
                return _context.abrupt("return", status);

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getStatus(_x) {
        return _getStatus.apply(this, arguments);
      }

      return getStatus;
    }()
    /**
     * Not supported
     */

  }, {
    key: "retrieveSavedMethods",
    value: function () {
      var _retrieveSavedMethods = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(customer) {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", []);

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function retrieveSavedMethods(_x2) {
        return _retrieveSavedMethods.apply(this, arguments);
      }

      return retrieveSavedMethods;
    }()
    /**
     * Creates a PayPal order, with an Authorize intent. The plugin doesn't
     * support shipping details at the moment.
     * Reference docs: https://developer.paypal.com/docs/api/orders/v2/
     * @param {object} cart - cart to create a payment for
     * @returns {object} the data to be stored with the payment session.
     */

  }, {
    key: "createPayment",
    value: function () {
      var _createPayment = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(cart) {
        var id, region_id, resource_id, currency_code, total, region, amount, request, res;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                id = cart.id, region_id = cart.region_id, resource_id = cart.resource_id, currency_code = cart.currency_code, total = cart.total;

                if (currency_code) {
                  _context3.next = 6;
                  break;
                }

                _context3.next = 4;
                return this.regionService_.retrieve(region_id);

              case 4:
                region = _context3.sent;
                currency_code = region.currency_code;

              case 6:
                amount = total;
                request = new _checkoutServerSdk["default"].orders.OrdersCreateRequest();
                request.requestBody({
                  intent: "AUTHORIZE",
                  application_context: {
                    shipping_preference: "NO_SHIPPING"
                  },
                  purchase_units: [{
                    custom_id: resource_id !== null && resource_id !== void 0 ? resource_id : id,
                    amount: {
                      currency_code: currency_code.toUpperCase(),
                      value: roundToTwo((0, _medusaCoreUtils.humanizeAmount)(amount, currency_code), currency_code)
                    }
                  }]
                });
                _context3.next = 11;
                return this.paypal_.execute(request);

              case 11:
                res = _context3.sent;
                return _context3.abrupt("return", {
                  id: res.result.id
                });

              case 13:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function createPayment(_x3) {
        return _createPayment.apply(this, arguments);
      }

      return createPayment;
    }()
    /**
     * Retrieves a PayPal order.
     * @param {object} data - the data stored with the payment
     * @returns {Promise<object>} PayPal order
     */

  }, {
    key: "retrievePayment",
    value: function () {
      var _retrievePayment = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(data) {
        var request, res;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                request = new _checkoutServerSdk["default"].orders.OrdersGetRequest(data.id);
                _context4.next = 4;
                return this.paypal_.execute(request);

              case 4:
                res = _context4.sent;
                return _context4.abrupt("return", res.result);

              case 8:
                _context4.prev = 8;
                _context4.t0 = _context4["catch"](0);
                throw _context4.t0;

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 8]]);
      }));

      function retrievePayment(_x4) {
        return _retrievePayment.apply(this, arguments);
      }

      return retrievePayment;
    }()
    /**
     * Gets the payment data from a payment session
     * @param {object} session - the session to fetch payment data for.
     * @returns {Promise<object>} the PayPal order object
     */

  }, {
    key: "getPaymentData",
    value: function () {
      var _getPaymentData = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(session) {
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                return _context5.abrupt("return", this.retrievePayment(session.data));

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

      function getPaymentData(_x5) {
        return _getPaymentData.apply(this, arguments);
      }

      return getPaymentData;
    }()
    /**
     * This method does not call the PayPal authorize function, but fetches the
     * status of the payment as it is expected to have been authorized client side.
     * @param {object} session - payment session
     * @param {object} context - properties relevant to current context
     * @returns {Promise<{ status: string, data: object }>} result with data and status
     */

  }, {
    key: "authorizePayment",
    value: function () {
      var _authorizePayment = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(session) {
        var context,
            stat,
            _args6 = arguments;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                context = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : {};
                _context6.next = 3;
                return this.getStatus(session.data);

              case 3:
                stat = _context6.sent;
                _context6.prev = 4;
                return _context6.abrupt("return", {
                  data: session.data,
                  status: stat
                });

              case 8:
                _context6.prev = 8;
                _context6.t0 = _context6["catch"](4);
                throw _context6.t0;

              case 11:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[4, 8]]);
      }));

      function authorizePayment(_x6) {
        return _authorizePayment.apply(this, arguments);
      }

      return authorizePayment;
    }()
    /**
     * Updates the data stored with the payment session.
     * @param {object} data - the currently stored data.
     * @param {object} update - the update data to store.
     * @returns {object} the merged data of the two arguments.
     */

  }, {
    key: "updatePaymentData",
    value: function () {
      var _updatePaymentData = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(data, update) {
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                return _context7.abrupt("return", _objectSpread(_objectSpread({}, data), update.data));

              case 4:
                _context7.prev = 4;
                _context7.t0 = _context7["catch"](0);
                throw _context7.t0;

              case 7:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 4]]);
      }));

      function updatePaymentData(_x7, _x8) {
        return _updatePaymentData.apply(this, arguments);
      }

      return updatePaymentData;
    }()
    /**
     * Updates the PayPal order.
     * @param {object} sessionData - payment session data.
     * @param {object} cart - the cart to update by.
     * @returns {object} the resulting order object.
     */

  }, {
    key: "updatePayment",
    value: function () {
      var _updatePayment = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(sessionData, cart) {
        var currency_code, total, region_id, region, request;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;
                currency_code = cart.currency_code, total = cart.total, region_id = cart.region_id;

                if (currency_code) {
                  _context8.next = 7;
                  break;
                }

                _context8.next = 5;
                return this.regionService_.retrieve(region_id);

              case 5:
                region = _context8.sent;
                currency_code = region.currency_code;

              case 7:
                request = new _checkoutServerSdk["default"].orders.OrdersPatchRequest(sessionData.id);
                request.requestBody([{
                  op: "replace",
                  path: "/purchase_units/@reference_id=='default'",
                  value: {
                    amount: {
                      currency_code: currency_code.toUpperCase(),
                      value: roundToTwo((0, _medusaCoreUtils.humanizeAmount)(total, currency_code), currency_code)
                    }
                  }
                }]);
                _context8.next = 11;
                return this.paypal_.execute(request);

              case 11:
                return _context8.abrupt("return", sessionData);

              case 14:
                _context8.prev = 14;
                _context8.t0 = _context8["catch"](0);
                return _context8.abrupt("return", this.createPayment(cart));

              case 17:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[0, 14]]);
      }));

      function updatePayment(_x9, _x10) {
        return _updatePayment.apply(this, arguments);
      }

      return updatePayment;
    }()
    /**
     * Not suported
     */

  }, {
    key: "deletePayment",
    value: function () {
      var _deletePayment = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(payment) {
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                return _context9.abrupt("return");

              case 1:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function deletePayment(_x11) {
        return _deletePayment.apply(this, arguments);
      }

      return deletePayment;
    }()
    /**
     * Captures a previously authorized order.
     * @param {object} payment - the payment to capture
     * @returns {object} the PayPal order
     */

  }, {
    key: "capturePayment",
    value: function () {
      var _capturePayment = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(payment) {
        var purchase_units, id, request;
        return _regeneratorRuntime().wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                purchase_units = payment.data.purchase_units;
                id = purchase_units[0].payments.authorizations[0].id;
                _context10.prev = 2;
                request = new _checkoutServerSdk["default"].payments.AuthorizationsCaptureRequest(id);
                _context10.next = 6;
                return this.paypal_.execute(request);

              case 6:
                return _context10.abrupt("return", this.retrievePayment(payment.data));

              case 9:
                _context10.prev = 9;
                _context10.t0 = _context10["catch"](2);
                throw _context10.t0;

              case 12:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this, [[2, 9]]);
      }));

      function capturePayment(_x12) {
        return _capturePayment.apply(this, arguments);
      }

      return capturePayment;
    }()
    /**
     * Refunds a given amount.
     * @param {object} payment - payment to refund
     * @param {number} amountToRefund - amount to refund
     * @returns {Promise<Object>} the resulting PayPal order
     */

  }, {
    key: "refundPayment",
    value: function () {
      var _refundPayment = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(payment, amountToRefund) {
        var purchase_units, payments, payId, request;
        return _regeneratorRuntime().wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                purchase_units = payment.data.purchase_units;
                _context11.prev = 1;
                payments = purchase_units[0].payments;

                if (payments && payments.captures.length) {
                  _context11.next = 5;
                  break;
                }

                throw new Error("Order not yet captured");

              case 5:
                payId = payments.captures[0].id;
                request = new _checkoutServerSdk["default"].payments.CapturesRefundRequest(payId);
                request.requestBody({
                  amount: {
                    currency_code: payment.currency_code.toUpperCase(),
                    value: roundToTwo((0, _medusaCoreUtils.humanizeAmount)(amountToRefund, payment.currency_code), payment.currency_code)
                  }
                });
                _context11.next = 10;
                return this.paypal_.execute(request);

              case 10:
                return _context11.abrupt("return", this.retrievePayment(payment.data));

              case 13:
                _context11.prev = 13;
                _context11.t0 = _context11["catch"](1);
                throw _context11.t0;

              case 16:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this, [[1, 13]]);
      }));

      function refundPayment(_x13, _x14) {
        return _refundPayment.apply(this, arguments);
      }

      return refundPayment;
    }()
    /**
     * Cancels payment for paypal payment.
     * @param {Payment} payment - payment object
     * @returns {Promise<object>} canceled payment intent
     */

  }, {
    key: "cancelPayment",
    value: function () {
      var _cancelPayment = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(payment) {
        var order, isAlreadyCanceled, isCanceledAndFullyRefund, purchase_units, payments, payId, request, id, _request;

        return _regeneratorRuntime().wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return this.retrievePayment(payment.data);

              case 2:
                order = _context12.sent;
                isAlreadyCanceled = order.status === "VOIDED";
                isCanceledAndFullyRefund = order.status === "COMPLETED" && !!order.invoice_id;

                if (!(isAlreadyCanceled || isCanceledAndFullyRefund)) {
                  _context12.next = 7;
                  break;
                }

                return _context12.abrupt("return", order);

              case 7:
                _context12.prev = 7;
                purchase_units = payment.data.purchase_units;

                if (!payment.captured_at) {
                  _context12.next = 17;
                  break;
                }

                payments = purchase_units[0].payments;
                payId = payments.captures[0].id;
                request = new _checkoutServerSdk["default"].payments.CapturesRefundRequest(payId);
                _context12.next = 15;
                return this.paypal_.execute(request);

              case 15:
                _context12.next = 21;
                break;

              case 17:
                id = purchase_units[0].payments.authorizations[0].id;
                _request = new _checkoutServerSdk["default"].payments.AuthorizationsVoidRequest(id);
                _context12.next = 21;
                return this.paypal_.execute(_request);

              case 21:
                _context12.next = 23;
                return this.retrievePayment(payment.data);

              case 23:
                return _context12.abrupt("return", _context12.sent);

              case 26:
                _context12.prev = 26;
                _context12.t0 = _context12["catch"](7);
                throw _context12.t0;

              case 29:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this, [[7, 26]]);
      }));

      function cancelPayment(_x15) {
        return _cancelPayment.apply(this, arguments);
      }

      return cancelPayment;
    }()
    /**
     * Given a PayPal authorization object the method will find the order that
     * created the authorization, by following the HATEOAS link to the order.
     * @param {object} auth - the authorization object.
     * @returns {Promise<object>} the PayPal order object
     */

  }, {
    key: "retrieveOrderFromAuth",
    value: function () {
      var _retrieveOrderFromAuth = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(auth) {
        var link, parts, orderId, orderReq, res;
        return _regeneratorRuntime().wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                link = auth.links.find(function (l) {
                  return l.rel === "up";
                });
                parts = link.href.split("/");
                orderId = parts[parts.length - 1];
                orderReq = new _checkoutServerSdk["default"].orders.OrdersGetRequest(orderId);
                _context13.next = 6;
                return this.paypal_.execute(orderReq);

              case 6:
                res = _context13.sent;

                if (!res.result) {
                  _context13.next = 9;
                  break;
                }

                return _context13.abrupt("return", res.result);

              case 9:
                return _context13.abrupt("return", null);

              case 10:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function retrieveOrderFromAuth(_x16) {
        return _retrieveOrderFromAuth.apply(this, arguments);
      }

      return retrieveOrderFromAuth;
    }()
    /**
     * Retrieves a PayPal authorization.
     * @param {string} id - the id of the authorization.
     * @returns {Promise<object>} the authorization.
     */

  }, {
    key: "retrieveAuthorization",
    value: function () {
      var _retrieveAuthorization = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(id) {
        var authReq, res;
        return _regeneratorRuntime().wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                authReq = new _checkoutServerSdk["default"].payments.AuthorizationsGetRequest(id);
                _context14.next = 3;
                return this.paypal_.execute(authReq);

              case 3:
                res = _context14.sent;

                if (!res.result) {
                  _context14.next = 6;
                  break;
                }

                return _context14.abrupt("return", res.result);

              case 6:
                return _context14.abrupt("return", null);

              case 7:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function retrieveAuthorization(_x17) {
        return _retrieveAuthorization.apply(this, arguments);
      }

      return retrieveAuthorization;
    }()
    /**
     * Checks if a webhook is verified.
     * @param {object} data - the verficiation data.
     * @returns {Promise<object>} the response of the verification request.
     */

  }, {
    key: "verifyWebhook",
    value: function () {
      var _verifyWebhook = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15(data) {
        var verifyReq;
        return _regeneratorRuntime().wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                verifyReq = {
                  verb: "POST",
                  path: "/v1/notifications/verify-webhook-signature",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: _objectSpread({
                    webhook_id: this.options_.auth_webhook_id
                  }, data)
                };
                return _context15.abrupt("return", this.paypal_.execute(verifyReq));

              case 2:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function verifyWebhook(_x18) {
        return _verifyWebhook.apply(this, arguments);
      }

      return verifyWebhook;
    }()
    /**
     * Upserts a webhook that listens for order authorizations.
     */

  }, {
    key: "ensureWebhooks",
    value: function () {
      var _ensureWebhooks = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee16() {
        var _this2 = this;

        var webhookReq, webhookRes, found, whCreateReq;
        return _regeneratorRuntime().wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                if (this.options_.backend_url) {
                  _context16.next = 2;
                  break;
                }

                return _context16.abrupt("return");

              case 2:
                webhookReq = {
                  verb: "GET",
                  path: "/v1/notifications/webhooks"
                };
                _context16.next = 5;
                return this.paypal_.execute(webhookReq);

              case 5:
                webhookRes = _context16.sent;

                if (webhookRes.result && webhookRes.result.webhooks) {
                  found = webhookRes.result.webhooks.find(function (w) {
                    var notificationType = w.event_types.find(function (e) {
                      return e.name === "PAYMENT.AUTHORIZATION.CREATED";
                    });
                    return !!notificationType && w.url === "".concat(_this2.options_.backend_url, "/paypal/hooks");
                  });
                }

                if (found) {
                  _context16.next = 11;
                  break;
                }

                whCreateReq = {
                  verb: "POST",
                  path: "/v1/notifications/webhooks",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: {
                    id: "medusa-auth-notification",
                    url: "".concat(this.options_.backend_url, "/paypal/hooks"),
                    event_types: [{
                      name: "PAYMENT.AUTHORIZATION.CREATED"
                    }]
                  }
                };
                _context16.next = 11;
                return this.paypal_.execute(whCreateReq);

              case 11:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function ensureWebhooks() {
        return _ensureWebhooks.apply(this, arguments);
      }

      return ensureWebhooks;
    }()
  }]);

  return PayPalProviderService;
}(_medusaInterfaces.PaymentService);

_defineProperty(PayPalProviderService, "identifier", "paypal");

var _default = PayPalProviderService;
exports["default"] = _default;