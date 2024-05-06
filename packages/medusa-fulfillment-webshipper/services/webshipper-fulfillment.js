"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _medusaCoreUtils = require("medusa-core-utils");
var _webshipper = _interopRequireDefault(require("../utils/webshipper"));
var _medusa = require("@medusajs/medusa");
var _utils = require("@medusajs/utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && _instanceof(outerFn.prototype, Generator) ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var WebshipperFulfillmentService = /*#__PURE__*/function (_AbstractFulfillmentS) {
  _inherits(WebshipperFulfillmentService, _AbstractFulfillmentS);
  var _super = _createSuper(WebshipperFulfillmentService);
  function WebshipperFulfillmentService(_ref, options) {
    var _this;
    var logger = _ref.logger,
      totalsService = _ref.totalsService,
      claimService = _ref.claimService,
      swapService = _ref.swapService,
      orderService = _ref.orderService;
    _classCallCheck(this, WebshipperFulfillmentService);
    _this = _super.apply(this, arguments);
    _this.options_ = options;
    if (!options.coo_countries) {
      _this.options_.coo_countries = ["all"];
    } else if (Array.isArray(options.coo_countries)) {
      _this.options_.coo_countries = options.coo_countries.map(function (c) {
        return c.toLowerCase();
      });
    } else if (typeof options.coo_countries === "string") {
      _this.options_.coo_countries = [options.coo_countries];
    }

    /** @private @const {logger} */
    _this.logger_ = logger;

    /** @private @const {OrderService} */
    _this.orderService_ = orderService;

    /** @private @const {TotalsService} */
    _this.totalsService_ = totalsService;

    /** @private @const {SwapService} */
    _this.swapService_ = swapService;

    /** @private @const {SwapService} */
    _this.claimService_ = claimService;

    /** @private @const {AxiosClient} */
    _this.client_ = new _webshipper["default"]({
      account: _this.options_.account,
      token: _this.options_.api_token
    });
    return _this;
  }
  _createClass(WebshipperFulfillmentService, [{
    key: "registerInvoiceGenerator",
    value: function registerInvoiceGenerator(service) {
      if (typeof service.createInvoice === "function") {
        this.invoiceGenerator_ = service;
      }
    }
  }, {
    key: "getFulfillmentOptions",
    value: function () {
      var _getFulfillmentOptions = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var rates;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.client_.shippingRates.list({
                order_channel_id: this.options_.order_channel_id
              });
            case 2:
              rates = _context.sent;
              return _context.abrupt("return", rates.data.map(function (r) {
                return {
                  id: r.attributes.name,
                  webshipper_id: r.id,
                  name: r.attributes.name,
                  require_drop_point: r.attributes.require_drop_point,
                  carrier_id: r.attributes.carrier_id,
                  is_return: r.attributes.is_return
                };
              }));
            case 4:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function getFulfillmentOptions() {
        return _getFulfillmentOptions.apply(this, arguments);
      }
      return getFulfillmentOptions;
    }()
  }, {
    key: "validateFulfillmentData",
    value: function () {
      var _validateFulfillmentData = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(optionData, data, _) {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!optionData.require_drop_point) {
                _context2.next = 5;
                break;
              }
              if (data.drop_point_id) {
                _context2.next = 5;
                break;
              }
              throw new Error("Must have drop point id");
            case 5:
              return _context2.abrupt("return", _objectSpread(_objectSpread({}, optionData), data));
            case 6:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function validateFulfillmentData(_x, _x2, _x3) {
        return _validateFulfillmentData.apply(this, arguments);
      }
      return validateFulfillmentData;
    }()
  }, {
    key: "validateOption",
    value: function () {
      var _validateOption = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(data) {
        var rate;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.client_.shippingRates.retrieve(data.webshipper_id)["catch"](function () {
                return undefined;
              });
            case 2:
              rate = _context3.sent;
              return _context3.abrupt("return", !!rate);
            case 4:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function validateOption(_x4) {
        return _validateOption.apply(this, arguments);
      }
      return validateOption;
    }()
  }, {
    key: "canCalculate",
    value: function canCalculate() {
      // Return whether or not we are able to calculate dynamically
      return false;
    }
  }, {
    key: "calculatePrice",
    value: function calculatePrice() {
      // Calculate prices
    }

    /**
     * Creates a return order in webshipper and links it to an existing shipment.
     */
  }, {
    key: "createReturnOrder",
    value: function () {
      var _createReturnOrder = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(shipment, fromOrder) {
        var _fromOrder$fulfillmen,
          _shipment$attributes,
          _shipment$attributes$,
          _shipment$attributes$2,
          _this2 = this,
          _shipment$shipping_me,
          _shipment$shipping_me2;
        var fulfillmentData, customsLines, returnOrderData;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              fulfillmentData = (_fromOrder$fulfillmen = fromOrder.fulfillments[0]) === null || _fromOrder$fulfillmen === void 0 ? void 0 : _fromOrder$fulfillmen.data;
              if (!(!(shipment !== null && shipment !== void 0 && shipment.id) || !(fulfillmentData !== null && fulfillmentData !== void 0 && fulfillmentData.id))) {
                _context4.next = 3;
                break;
              }
              return _context4.abrupt("return");
            case 3:
              customsLines = (_shipment$attributes = shipment.attributes) === null || _shipment$attributes === void 0 ? void 0 : (_shipment$attributes$ = _shipment$attributes.packages) === null || _shipment$attributes$ === void 0 ? void 0 : (_shipment$attributes$2 = _shipment$attributes$[0]) === null || _shipment$attributes$2 === void 0 ? void 0 : _shipment$attributes$2.customs_lines;
              if (customsLines !== null && customsLines !== void 0 && customsLines.length) {
                _context4.next = 6;
                break;
              }
              return _context4.abrupt("return");
            case 6:
              returnOrderData = {
                type: "returns",
                attributes: {
                  status: "pending",
                  return_lines: customsLines.map(function (_ref2) {
                    var _fulfillmentData$attr, _fulfillmentData$attr2, _fulfillmentData$attr3, _this2$options_$retur;
                    var ext_ref = _ref2.ext_ref,
                      quantity = _ref2.quantity;
                    return {
                      order_line_id: (_fulfillmentData$attr = fulfillmentData.attributes) === null || _fulfillmentData$attr === void 0 ? void 0 : (_fulfillmentData$attr2 = _fulfillmentData$attr.order_lines) === null || _fulfillmentData$attr2 === void 0 ? void 0 : (_fulfillmentData$attr3 = _fulfillmentData$attr2.find(function (order_line) {
                        return order_line.ext_ref === ext_ref;
                      })) === null || _fulfillmentData$attr3 === void 0 ? void 0 : _fulfillmentData$attr3.id,
                      cause_id: ((_this2$options_$retur = _this2.options_.return_portal) === null || _this2$options_$retur === void 0 ? void 0 : _this2$options_$retur.cause_id) || "1",
                      quantity: quantity
                    };
                  })
                },
                relationships: {
                  order: {
                    data: {
                      id: fulfillmentData.id,
                      type: "orders"
                    }
                  },
                  portal: {
                    data: {
                      id: this.options_.return_portal.id || "1",
                      type: "return_portals"
                    }
                  },
                  refund_method: {
                    data: {
                      id: this.options_.return_portal.refund_method_id || "1",
                      type: "return_refund_methods"
                    }
                  },
                  shipping_method: {
                    data: {
                      id: ((_shipment$shipping_me = shipment.shipping_method) === null || _shipment$shipping_me === void 0 ? void 0 : (_shipment$shipping_me2 = _shipment$shipping_me.data) === null || _shipment$shipping_me2 === void 0 ? void 0 : _shipment$shipping_me2.webshipper_id) || "1",
                      type: "return_shipping_methods"
                    }
                  },
                  shipment: {
                    data: {
                      id: shipment.id,
                      type: "shipments"
                    }
                  }
                }
              };
              this.client_.returns.create(returnOrderData);
            case 8:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function createReturnOrder(_x5, _x6) {
        return _createReturnOrder.apply(this, arguments);
      }
      return createReturnOrder;
    }()
    /**
     * Creates a return shipment in webshipper using the given method data, and
     * return lines.
     */
  }, {
    key: "createReturn",
    value: function () {
      var _createReturn = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(returnOrder) {
        var _this3 = this;
        var orderId, fromOrder, methodData, relationships, existing, docs, base64Invoice, shipping_address, returnShipment;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              if (returnOrder.order_id) {
                orderId = returnOrder.order_id;
              } else if (returnOrder.swap) {
                orderId = returnOrder.swap.order_id;
              } else if (returnOrder.claim_order) {
                orderId = returnOrder.claim_order.order_id;
              }
              _context6.next = 3;
              return this.orderService_.retrieve(orderId, {
                select: ["total"],
                relations: ["discounts", "discounts.rule", "shipping_address", "returns", "fulfillments"]
              });
            case 3:
              fromOrder = _context6.sent;
              methodData = returnOrder.shipping_method.data;
              relationships = {
                shipping_rate: {
                  data: {
                    type: "shipping_rates",
                    id: methodData.webshipper_id
                  }
                }
              };
              existing = fromOrder.metadata && fromOrder.metadata.webshipper_order_id;
              if (existing) {
                relationships.order = {
                  data: {
                    type: "orders",
                    id: existing
                  }
                };
              }
              docs = [];
              if (!this.invoiceGenerator_) {
                _context6.next = 14;
                break;
              }
              _context6.next = 12;
              return this.invoiceGenerator_.createReturnInvoice(fromOrder, returnOrder.items);
            case 12:
              base64Invoice = _context6.sent;
              docs.push({
                document_size: "A4",
                document_format: "PDF",
                base64: base64Invoice,
                document_type: "invoice"
              });
            case 14:
              shipping_address = fromOrder.shipping_address;
              _context6.t0 = "R".concat(fromOrder.display_id, "-").concat(fromOrder.returns.length + 1);
              _context6.t1 = "".concat(fromOrder.id, ".").concat(returnOrder.id);
              _context6.t2 = docs;
              _context6.t3 = {
                unit: "cm",
                height: 15,
                width: 15,
                length: 15
              };
              _context6.next = 21;
              return (0, _utils.promiseAll)(returnOrder.items.map( /*#__PURE__*/function () {
                var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(_ref3) {
                  var item, quantity, customLine;
                  return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                    while (1) switch (_context5.prev = _context5.next) {
                      case 0:
                        item = _ref3.item, quantity = _ref3.quantity;
                        _context5.next = 3;
                        return _this3.buildWebshipperItem(item, quantity, fromOrder);
                      case 3:
                        customLine = _context5.sent;
                        return _context5.abrupt("return", _objectSpread(_objectSpread({}, customLine), {}, {
                          currency: fromOrder.currency_code.toUpperCase()
                        }));
                      case 5:
                      case "end":
                        return _context5.stop();
                    }
                  }, _callee5);
                }));
                return function (_x8) {
                  return _ref4.apply(this, arguments);
                };
              }()));
            case 21:
              _context6.t4 = _context6.sent;
              _context6.t5 = {
                weight: 500,
                weight_unit: "g",
                dimensions: _context6.t3,
                customs_lines: _context6.t4
              };
              _context6.t6 = [_context6.t5];
              _context6.t7 = {
                att_contact: "".concat(shipping_address.first_name, " ").concat(shipping_address.last_name),
                // Some carriers require a company_name
                company_name: "".concat(shipping_address.first_name, " ").concat(shipping_address.last_name),
                address_1: shipping_address.address_1,
                address_2: shipping_address.address_2,
                zip: shipping_address.postal_code,
                city: shipping_address.city,
                country_code: shipping_address.country_code.toUpperCase(),
                state: shipping_address.province,
                phone: shipping_address.phone,
                email: fromOrder.email
              };
              _context6.t8 = this.options_.return_address;
              _context6.t9 = {
                reference: _context6.t0,
                ext_ref: _context6.t1,
                is_return: true,
                included_documents: _context6.t2,
                packages: _context6.t6,
                sender_address: _context6.t7,
                delivery_address: _context6.t8
              };
              _context6.t10 = relationships;
              returnShipment = {
                type: "shipments",
                attributes: _context6.t9,
                relationships: _context6.t10
              };
              return _context6.abrupt("return", this.client_.shipments.create(returnShipment).then(function (result) {
                var _this3$options_$retur;
                if ((_this3$options_$retur = _this3.options_.return_portal) !== null && _this3$options_$retur !== void 0 && _this3$options_$retur.id) {
                  _this3.createReturnOrder(result.data, fromOrder);
                }
                return result.data;
              })["catch"](function (err) {
                _this3.logger_.warn(err.response);
                throw err;
              }));
            case 30:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this);
      }));
      function createReturn(_x7) {
        return _createReturn.apply(this, arguments);
      }
      return createReturn;
    }()
  }, {
    key: "getReturnDocuments",
    value: function () {
      var _getReturnDocuments = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(data) {
        var shipment, labels, docs, toReturn, _iterator, _step, d, _iterator2, _step2, _d;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return this.client_.shipments.retrieve(data.id);
            case 2:
              shipment = _context7.sent;
              _context7.next = 5;
              return this.retrieveRelationship(shipment.data.relationships.labels).then(function (res) {
                return res.data;
              });
            case 5:
              labels = _context7.sent;
              _context7.next = 8;
              return this.retrieveRelationship(shipment.data.relationships.documents).then(function (res) {
                return res.data;
              });
            case 8:
              docs = _context7.sent;
              toReturn = [];
              _iterator = _createForOfIteratorHelper(labels);
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  d = _step.value;
                  toReturn.push({
                    name: "Return label",
                    base_64: d.attributes.base64,
                    type: "pdf"
                  });
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
              _iterator2 = _createForOfIteratorHelper(docs);
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  _d = _step2.value;
                  toReturn.push({
                    name: _d.attributes.document_type,
                    base_64: _d.attributes.base64,
                    type: "pdf"
                  });
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
              return _context7.abrupt("return", toReturn);
            case 15:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this);
      }));
      function getReturnDocuments(_x9) {
        return _getReturnDocuments.apply(this, arguments);
      }
      return getReturnDocuments;
    }()
  }, {
    key: "createFulfillment",
    value: function () {
      var _createFulfillment = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(methodData, fulfillmentItems, fromOrder, fulfillment) {
        var _this4 = this;
        var existing, webshipperOrder, shipping_address, _shipping_address$met, invoice, certificateOfOrigin, base64Invoice, cooCountries, base64Coo, id, visible_ref, ext_ref, newOrder, docData;
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              existing = fromOrder.metadata && fromOrder.metadata.webshipper_order_id;
              if (!existing) {
                _context9.next = 5;
                break;
              }
              _context9.next = 4;
              return this.client_.orders.retrieve(existing);
            case 4:
              webshipperOrder = _context9.sent;
            case 5:
              shipping_address = fromOrder.shipping_address;
              if (webshipperOrder) {
                _context9.next = 40;
                break;
              }
              if (!this.invoiceGenerator_) {
                _context9.next = 23;
                break;
              }
              _context9.next = 10;
              return this.invoiceGenerator_.createInvoice(fromOrder, fulfillmentItems);
            case 10:
              base64Invoice = _context9.sent;
              if (!base64Invoice) {
                _context9.next = 15;
                break;
              }
              _context9.next = 14;
              return this.client_.documents.create({
                type: "documents",
                attributes: {
                  document_size: this.options_.document_size || "A4",
                  document_format: "PDF",
                  base64: base64Invoice,
                  document_type: "invoice"
                }
              })["catch"](function (err) {
                throw err;
              });
            case 14:
              invoice = _context9.sent;
            case 15:
              cooCountries = this.options_.coo_countries;
              if (!((cooCountries.includes("all") || cooCountries.includes(shipping_address.country_code.toLowerCase())) && this.invoiceGenerator_.createCertificateOfOrigin)) {
                _context9.next = 23;
                break;
              }
              _context9.next = 19;
              return this.invoiceGenerator_.createCertificateOfOrigin(fromOrder, fulfillmentItems);
            case 19:
              base64Coo = _context9.sent;
              _context9.next = 22;
              return this.client_.documents.create({
                type: "documents",
                attributes: {
                  document_size: this.options_.document_size || "A4",
                  document_format: "PDF",
                  base64: base64Coo,
                  document_type: "certificate"
                }
              })["catch"](function (err) {
                throw err;
              });
            case 22:
              certificateOfOrigin = _context9.sent;
            case 23:
              id = fulfillment.id;
              visible_ref = "".concat(fromOrder.display_id, "-").concat(id.substr(id.length - 4));
              ext_ref = "".concat(fromOrder.id, ".").concat(fulfillment.id);
              if (fromOrder.is_swap) {
                ext_ref = "".concat(fromOrder.id, ".").concat(fulfillment.id);
                visible_ref = "S-".concat(fromOrder.display_id);
              }
              _context9.t0 = ext_ref;
              _context9.t1 = visible_ref;
              _context9.next = 31;
              return (0, _utils.promiseAll)(fulfillmentItems.map( /*#__PURE__*/function () {
                var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(item) {
                  var orderLine;
                  return _regeneratorRuntime().wrap(function _callee8$(_context8) {
                    while (1) switch (_context8.prev = _context8.next) {
                      case 0:
                        _context8.next = 2;
                        return _this4.buildWebshipperItem(item, item.quantity, fromOrder);
                      case 2:
                        orderLine = _context8.sent;
                        return _context8.abrupt("return", orderLine);
                      case 4:
                      case "end":
                        return _context8.stop();
                    }
                  }, _callee8);
                }));
                return function (_x14) {
                  return _ref5.apply(this, arguments);
                };
              }()));
            case 31:
              _context9.t2 = _context9.sent;
              _context9.t3 = {
                att_contact: "".concat(shipping_address.first_name, " ").concat(shipping_address.last_name),
                address_1: shipping_address.address_1,
                address_2: shipping_address.address_2,
                zip: shipping_address.postal_code,
                city: shipping_address.city,
                country_code: shipping_address.country_code.toUpperCase(),
                state: shipping_address.province,
                phone: shipping_address.phone,
                email: fromOrder.email,
                personal_customs_no: ((_shipping_address$met = shipping_address.metadata) === null || _shipping_address$met === void 0 ? void 0 : _shipping_address$met.personal_customs_no) || null
              };
              _context9.t4 = fromOrder.currency_code.toUpperCase();
              _context9.t5 = {
                status: "pending",
                ext_ref: _context9.t0,
                visible_ref: _context9.t1,
                order_lines: _context9.t2,
                delivery_address: _context9.t3,
                currency: _context9.t4
              };
              _context9.t6 = {
                order_channel: {
                  data: {
                    id: this.options_.order_channel_id,
                    type: "order_channels"
                  }
                },
                shipping_rate: {
                  data: {
                    id: methodData.webshipper_id,
                    type: "shipping_rates"
                  }
                }
              };
              newOrder = {
                type: "orders",
                attributes: _context9.t5,
                relationships: _context9.t6
              };
              if (methodData.require_drop_point) {
                newOrder.attributes.drop_point = {
                  drop_point_id: methodData.drop_point_id,
                  name: methodData.drop_point_name,
                  zip: methodData.drop_point_zip,
                  address_1: methodData.drop_point_address_1,
                  city: methodData.drop_point_city,
                  country_code: methodData.drop_point_country_code.toUpperCase()
                };
              }
              if (invoice || certificateOfOrigin) {
                docData = [];
                if (invoice) {
                  docData.push({
                    id: invoice.data.id,
                    type: invoice.data.type
                  });
                }
                if (certificateOfOrigin) {
                  docData.push({
                    id: certificateOfOrigin.data.id,
                    type: certificateOfOrigin.data.type
                  });
                }
                newOrder.relationships.documents = {
                  data: docData
                };
              }
              return _context9.abrupt("return", this.client_.orders.create(newOrder).then(function (result) {
                return result.data;
              })["catch"](function (err) {
                _this4.logger_.warn(err.response);
                throw err;
              }));
            case 40:
            case "end":
              return _context9.stop();
          }
        }, _callee9, this);
      }));
      function createFulfillment(_x10, _x11, _x12, _x13) {
        return _createFulfillment.apply(this, arguments);
      }
      return createFulfillment;
    }()
  }, {
    key: "handleWebhook",
    value: function () {
      var _handleWebhook = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(_, body) {
        var wsOrder, trackingLinks, _wsOrder$data$attribu, _wsOrder$data$attribu2, orderId, fulfillmentIndex, swap, fulfillment, order, _fulfillment;
        return _regeneratorRuntime().wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return this.retrieveRelationship(body.data.relationships.order);
            case 2:
              wsOrder = _context10.sent;
              if (!(wsOrder.data && wsOrder.data.attributes.ext_ref)) {
                _context10.next = 32;
                break;
              }
              trackingLinks = body.data.attributes.tracking_links.map(function (l) {
                return {
                  url: l.url,
                  tracking_number: l.number
                };
              });
              _wsOrder$data$attribu = wsOrder.data.attributes.ext_ref.split("."), _wsOrder$data$attribu2 = _slicedToArray(_wsOrder$data$attribu, 2), orderId = _wsOrder$data$attribu2[0], fulfillmentIndex = _wsOrder$data$attribu2[1];
              if (!(orderId.charAt(0).toLowerCase() === "s")) {
                _context10.next = 18;
                break;
              }
              if (!fulfillmentIndex.startsWith("ful")) {
                _context10.next = 11;
                break;
              }
              return _context10.abrupt("return", this.swapService_.createShipment(orderId, fulfillmentIndex, trackingLinks));
            case 11:
              _context10.next = 13;
              return this.swapService_.retrieve(orderId.substring(1), {
                relations: ["fulfillments"]
              });
            case 13:
              swap = _context10.sent;
              fulfillment = swap.fulfillments[fulfillmentIndex];
              return _context10.abrupt("return", this.swapService_.createShipment(swap.id, fulfillment.id, trackingLinks));
            case 16:
              _context10.next = 32;
              break;
            case 18:
              if (!(orderId.charAt(0).toLowerCase() === "c")) {
                _context10.next = 22;
                break;
              }
              return _context10.abrupt("return", this.claimService_.createShipment(orderId, fulfillmentIndex, trackingLinks));
            case 22:
              if (!fulfillmentIndex.startsWith("ful")) {
                _context10.next = 26;
                break;
              }
              return _context10.abrupt("return", this.orderService_.createShipment(orderId, fulfillmentIndex, trackingLinks));
            case 26:
              _context10.next = 28;
              return this.orderService_.retrieve(orderId, {
                relations: ["fulfillments"]
              });
            case 28:
              order = _context10.sent;
              _fulfillment = order.fulfillments[fulfillmentIndex];
              if (!_fulfillment) {
                _context10.next = 32;
                break;
              }
              return _context10.abrupt("return", this.orderService_.createShipment(order.id, _fulfillment.id, trackingLinks));
            case 32:
            case "end":
              return _context10.stop();
          }
        }, _callee10, this);
      }));
      function handleWebhook(_x15, _x16) {
        return _handleWebhook.apply(this, arguments);
      }
      return handleWebhook;
    }()
  }, {
    key: "retrieveDocuments",
    value: function () {
      var _retrieveDocuments = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(fulfillmentData, documentType) {
        var _fulfillmentData$rela, _fulfillmentData$rela2;
        var labelRelation, docRelation, docs, _docs;
        return _regeneratorRuntime().wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              labelRelation = fulfillmentData === null || fulfillmentData === void 0 ? void 0 : (_fulfillmentData$rela = fulfillmentData.relationships) === null || _fulfillmentData$rela === void 0 ? void 0 : _fulfillmentData$rela.labels;
              docRelation = fulfillmentData === null || fulfillmentData === void 0 ? void 0 : (_fulfillmentData$rela2 = fulfillmentData.relationships) === null || _fulfillmentData$rela2 === void 0 ? void 0 : _fulfillmentData$rela2.documents;
              _context11.t0 = documentType;
              _context11.next = _context11.t0 === "label" ? 5 : _context11.t0 === "invoice" ? 11 : 17;
              break;
            case 5:
              if (!labelRelation) {
                _context11.next = 10;
                break;
              }
              _context11.next = 8;
              return this.retrieveRelationship(labelRelation).then(function (_ref6) {
                var data = _ref6.data;
                return data;
              })["catch"](function (_) {
                return [];
              });
            case 8:
              docs = _context11.sent;
              return _context11.abrupt("return", docs.map(function (d) {
                return {
                  name: d.attributes.document_type,
                  base_64: d.attributes.base64,
                  type: "application/pdf"
                };
              }));
            case 10:
              return _context11.abrupt("return", []);
            case 11:
              if (!docRelation) {
                _context11.next = 16;
                break;
              }
              _context11.next = 14;
              return this.retrieveRelationship(docRelation).then(function (_ref7) {
                var data = _ref7.data;
                return data;
              })["catch"](function (_) {
                return [];
              });
            case 14:
              _docs = _context11.sent;
              return _context11.abrupt("return", _docs.map(function (d) {
                return {
                  name: d.attributes.document_type,
                  base_64: d.attributes.base64,
                  type: "application/pdf"
                };
              }));
            case 16:
              return _context11.abrupt("return", []);
            case 17:
              return _context11.abrupt("return", []);
            case 18:
            case "end":
              return _context11.stop();
          }
        }, _callee11, this);
      }));
      function retrieveDocuments(_x17, _x18) {
        return _retrieveDocuments.apply(this, arguments);
      }
      return retrieveDocuments;
    }()
  }, {
    key: "getFulfillmentDocuments",
    value: function () {
      var _getFulfillmentDocuments = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(data) {
        var order, docs;
        return _regeneratorRuntime().wrap(function _callee12$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return this.client_.orders.retrieve(data.id);
            case 2:
              order = _context12.sent;
              _context12.next = 5;
              return this.retrieveRelationship(order.data.relationships.documents).then(function (res) {
                return res.data;
              });
            case 5:
              docs = _context12.sent;
              return _context12.abrupt("return", docs.map(function (d) {
                return {
                  name: d.attributes.document_type,
                  base_64: d.attributes.base64,
                  type: "pdf"
                };
              }));
            case 7:
            case "end":
              return _context12.stop();
          }
        }, _callee12, this);
      }));
      function getFulfillmentDocuments(_x19) {
        return _getFulfillmentDocuments.apply(this, arguments);
      }
      return getFulfillmentDocuments;
    }()
  }, {
    key: "retrieveDropPoints",
    value: function () {
      var _retrieveDropPoints = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(id, zip, countryCode, address1) {
        var points;
        return _regeneratorRuntime().wrap(function _callee13$(_context13) {
          while (1) switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return this.client_.request({
                method: "POST",
                url: "/v2/drop_point_locators",
                data: {
                  data: {
                    type: "drop_point_locators",
                    attributes: {
                      shipping_rate_id: id,
                      delivery_address: {
                        zip: zip,
                        country_code: countryCode.toUpperCase(),
                        address_1: address1
                      }
                    }
                  }
                }
              }).then(function (_ref8) {
                var data = _ref8.data;
                return data;
              });
            case 2:
              points = _context13.sent;
              return _context13.abrupt("return", points.attributes.drop_points);
            case 4:
            case "end":
              return _context13.stop();
          }
        }, _callee13, this);
      }));
      function retrieveDropPoints(_x20, _x21, _x22, _x23) {
        return _retrieveDropPoints.apply(this, arguments);
      }
      return retrieveDropPoints;
    }()
  }, {
    key: "retrieveRelationship",
    value: function retrieveRelationship(relation) {
      var link = relation.links.related;
      return this.client_.request({
        method: "GET",
        url: link
      });
    }

    /**
     * Cancels a fulfillment. If the fulfillment has already been canceled this
     * is idemptotent. Can only cancel pending orders.
     * @param {object} data - the fulfilment data
     * @return {Promise<object>} the result of the cancellation
     */
  }, {
    key: "cancelFulfillment",
    value: function () {
      var _cancelFulfillment = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(data) {
        var order;
        return _regeneratorRuntime().wrap(function _callee14$(_context14) {
          while (1) switch (_context14.prev = _context14.next) {
            case 0:
              if (Array.isArray(data)) {
                data = data[0];
              }
              _context14.next = 3;
              return this.client_.orders.retrieve(data.id)["catch"](function () {
                return undefined;
              });
            case 3:
              order = _context14.sent;
              if (order) {
                _context14.next = 6;
                break;
              }
              return _context14.abrupt("return", Promise.resolve());
            case 6:
              if (!this.options_.delete_on_cancel) {
                _context14.next = 10;
                break;
              }
              _context14.next = 9;
              return this.client_.orders["delete"](data.id);
            case 9:
              return _context14.abrupt("return", _context14.sent);
            case 10:
              _context14.next = 12;
              return this.client_.orders.update(data.id, {
                id: data.id,
                type: "orders",
                attributes: {
                  status: "cancelled"
                }
              });
            case 12:
              return _context14.abrupt("return", _context14.sent);
            case 13:
            case "end":
              return _context14.stop();
          }
        }, _callee14, this);
      }));
      function cancelFulfillment(_x24) {
        return _cancelFulfillment.apply(this, arguments);
      }
      return cancelFulfillment;
    }()
  }, {
    key: "buildWebshipperItem",
    value: function () {
      var _buildWebshipperItem = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15(item, quantity, order) {
        var _item$variant, _item$variant2, _item$variant2$produc, _item$variant3, _item$variant4, _item$variant5, _item$variant5$produc;
        var totals, webShipperItem, coo, sku, tarifNumber;
        return _regeneratorRuntime().wrap(function _callee15$(_context15) {
          while (1) switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return this.totalsService_.getLineItemTotals(item, order, {
                include_tax: true,
                use_tax_lines: true
              });
            case 2:
              totals = _context15.sent;
              webShipperItem = {
                ext_ref: item.id,
                description: item.title,
                quantity: quantity,
                unit_price: (0, _medusaCoreUtils.humanizeAmount)(totals.unit_price, order.currency_code),
                vat_percent: totals.tax_lines.reduce(function (acc, next) {
                  return acc + next.rate;
                }, 0)
              };
              coo = (item === null || item === void 0 ? void 0 : (_item$variant = item.variant) === null || _item$variant === void 0 ? void 0 : _item$variant.origin_country) || (item === null || item === void 0 ? void 0 : (_item$variant2 = item.variant) === null || _item$variant2 === void 0 ? void 0 : (_item$variant2$produc = _item$variant2.product) === null || _item$variant2$produc === void 0 ? void 0 : _item$variant2$produc.origin_country);
              sku = item === null || item === void 0 ? void 0 : (_item$variant3 = item.variant) === null || _item$variant3 === void 0 ? void 0 : _item$variant3.sku;
              tarifNumber = (item === null || item === void 0 ? void 0 : (_item$variant4 = item.variant) === null || _item$variant4 === void 0 ? void 0 : _item$variant4.hs_code) || (item === null || item === void 0 ? void 0 : (_item$variant5 = item.variant) === null || _item$variant5 === void 0 ? void 0 : (_item$variant5$produc = _item$variant5.product) === null || _item$variant5$produc === void 0 ? void 0 : _item$variant5$produc.hs_code);
              if (coo) {
                webShipperItem.country_of_origin = coo;
              }
              if (sku) {
                webShipperItem.sku = sku;
              }
              if (tarifNumber) {
                webShipperItem.tarif_number = tarifNumber;
              }
              return _context15.abrupt("return", webShipperItem);
            case 11:
            case "end":
              return _context15.stop();
          }
        }, _callee15, this);
      }));
      function buildWebshipperItem(_x25, _x26, _x27) {
        return _buildWebshipperItem.apply(this, arguments);
      }
      return buildWebshipperItem;
    }()
  }]);
  return WebshipperFulfillmentService;
}(_medusa.AbstractFulfillmentService);
_defineProperty(WebshipperFulfillmentService, "identifier", "webshipper");
var _default = WebshipperFulfillmentService;
exports["default"] = _default;