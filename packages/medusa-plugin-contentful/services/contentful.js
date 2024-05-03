"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _medusaInterfaces = require("medusa-interfaces");
var _lodash = _interopRequireDefault(require("lodash"));
var _contentfulManagement = require("contentful-management");
var _utils = require("@medusajs/utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && _instanceof(outerFn.prototype, Generator) ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var IGNORE_THRESHOLD = 2; // seconds
var ContentfulService = /*#__PURE__*/function (_BaseService) {
  _inherits(ContentfulService, _BaseService);
  var _super = _createSuper(ContentfulService);
  function ContentfulService(_ref, options) {
    var _this;
    var regionService = _ref.regionService,
      productService = _ref.productService,
      cacheService = _ref.cacheService,
      productVariantService = _ref.productVariantService,
      eventBusService = _ref.eventBusService,
      productVariantInventoryService = _ref.productVariantInventoryService,
      featureFlagRouter = _ref.featureFlagRouter;
    _classCallCheck(this, ContentfulService);
    _this = _super.call(this);
    _this.productService_ = productService;
    _this.productVariantService_ = productVariantService;
    _this.regionService_ = regionService;
    _this.eventBus_ = eventBusService;
    _this.options_ = options;
    _this.contentful_ = (0, _contentfulManagement.createClient)({
      accessToken: options.access_token
    });
    _this.cacheService_ = cacheService;
    _this.productVariantInventoryService_ = productVariantInventoryService;
    _this.featureFlagRouter_ = featureFlagRouter;
    _this.capab_ = {};
    return _this;
  }
  _createClass(ContentfulService, [{
    key: "addIgnore_",
    value: function () {
      var _addIgnore_ = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(id, side) {
        var key;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              key = "".concat(id, "_ignore_").concat(side);
              _context.next = 3;
              return this.cacheService_.set(key, 1, this.options_.ignore_threshold || IGNORE_THRESHOLD);
            case 3:
              return _context.abrupt("return", _context.sent);
            case 4:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function addIgnore_(_x, _x2) {
        return _addIgnore_.apply(this, arguments);
      }
      return addIgnore_;
    }()
  }, {
    key: "shouldIgnore_",
    value: function () {
      var _shouldIgnore_ = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(id, side) {
        var key;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              key = "".concat(id, "_ignore_").concat(side);
              _context2.next = 3;
              return this.cacheService_.get(key);
            case 3:
              return _context2.abrupt("return", _context2.sent);
            case 4:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function shouldIgnore_(_x3, _x4) {
        return _shouldIgnore_.apply(this, arguments);
      }
      return shouldIgnore_;
    }()
  }, {
    key: "getContentfulEnvironment_",
    value: function () {
      var _getContentfulEnvironment_ = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        var space, environment;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.contentful_.getSpace(this.options_.space_id);
            case 2:
              space = _context3.sent;
              _context3.next = 5;
              return space.getEnvironment(this.options_.environment);
            case 5:
              environment = _context3.sent;
              return _context3.abrupt("return", environment);
            case 7:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function getContentfulEnvironment_() {
        return _getContentfulEnvironment_.apply(this, arguments);
      }
      return getContentfulEnvironment_;
    }()
  }, {
    key: "getVariantEntries_",
    value: function () {
      var _getVariantEntries_ = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(variants) {
        var _this2 = this;
        var config,
          contentfulVariants,
          _args5 = arguments;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              config = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : {
                publish: false
              };
              _context5.next = 3;
              return (0, _utils.promiseAll)(variants.map( /*#__PURE__*/function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(variant) {
                  var updated;
                  return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                    while (1) switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return _this2.updateProductVariantInContentful(variant);
                      case 2:
                        updated = _context4.sent;
                        if (config.publish) {
                          updated = updated.publish();
                        }
                        return _context4.abrupt("return", updated);
                      case 5:
                      case "end":
                        return _context4.stop();
                    }
                  }, _callee4);
                }));
                return function (_x6) {
                  return _ref2.apply(this, arguments);
                };
              }()));
            case 3:
              contentfulVariants = _context5.sent;
              return _context5.abrupt("return", contentfulVariants);
            case 5:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      function getVariantEntries_(_x5) {
        return _getVariantEntries_.apply(this, arguments);
      }
      return getVariantEntries_;
    }()
  }, {
    key: "getLink_",
    value: function getLink_(fromEntry) {
      return {
        sys: {
          type: "Link",
          linkType: "Entry",
          id: fromEntry.sys.id
        }
      };
    }
  }, {
    key: "getVariantLinks_",
    value: function getVariantLinks_(variantEntries) {
      var _this3 = this;
      return variantEntries.map(function (v) {
        return _this3.getLink_(v);
      });
    }
  }, {
    key: "createImageAssets",
    value: function () {
      var _createImageAssets = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(product) {
        var environment, assets;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return this.getContentfulEnvironment_();
            case 2:
              environment = _context7.sent;
              assets = [];
              _context7.next = 6;
              return Promise.all(product.images.filter(function (image) {
                return image.url !== product.thumbnail;
              }).map( /*#__PURE__*/function () {
                var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(image, i) {
                  var asset, finalAsset;
                  return _regeneratorRuntime().wrap(function _callee6$(_context6) {
                    while (1) switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return environment.createAsset({
                          fields: {
                            title: {
                              "en-US": "".concat(product.title, " - ").concat(i)
                            },
                            description: {
                              "en-US": ""
                            },
                            file: {
                              "en-US": {
                                contentType: "image/xyz",
                                fileName: image.url,
                                upload: image.url
                              }
                            }
                          }
                        });
                      case 2:
                        asset = _context6.sent;
                        _context6.next = 5;
                        return asset.processForAllLocales().then(function (ast) {
                          return ast.publish();
                        });
                      case 5:
                        finalAsset = _context6.sent;
                        assets.push({
                          sys: {
                            type: "Link",
                            linkType: "Asset",
                            id: finalAsset.sys.id
                          }
                        });
                      case 7:
                      case "end":
                        return _context6.stop();
                    }
                  }, _callee6);
                }));
                return function (_x8, _x9) {
                  return _ref3.apply(this, arguments);
                };
              }()));
            case 6:
              return _context7.abrupt("return", assets);
            case 7:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this);
      }));
      function createImageAssets(_x7) {
        return _createImageAssets.apply(this, arguments);
      }
      return createImageAssets;
    }()
  }, {
    key: "getCustomField",
    value: function getCustomField(field, type) {
      var customOptions = this.options_["custom_".concat(type, "_fields")];
      if (customOptions) {
        return customOptions[field] || field;
      } else {
        return field;
      }
    }
  }, {
    key: "createProductInContentful",
    value: function () {
      var _createProductInContentful = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(product) {
        var _fields;
        var p, environment, variantEntries, variantLinks, fields, imageLinks, thumbnailAsset, thumbnailLink, result;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return this.productService_.retrieve(product.id, {
                relations: ["variants", "options", "tags", "type", "collection", "images"]
              });
            case 2:
              p = _context8.sent;
              _context8.next = 5;
              return this.getContentfulEnvironment_();
            case 5:
              environment = _context8.sent;
              _context8.next = 8;
              return this.getVariantEntries_(p.variants, {
                publish: true
              });
            case 8:
              variantEntries = _context8.sent;
              variantLinks = this.getVariantLinks_(variantEntries);
              fields = (_fields = {}, _defineProperty(_fields, this.getCustomField("title", "product"), {
                "en-US": p.title
              }), _defineProperty(_fields, this.getCustomField("subtitle", "product"), {
                "en-US": p.subtitle
              }), _defineProperty(_fields, this.getCustomField("description", "product"), {
                "en-US": p.description
              }), _defineProperty(_fields, this.getCustomField("variants", "product"), {
                "en-US": variantLinks
              }), _defineProperty(_fields, this.getCustomField("options", "product"), {
                "en-US": this.transformMedusaIds(p.options)
              }), _defineProperty(_fields, this.getCustomField("medusaId", "product"), {
                "en-US": p.id
              }), _fields);
              if (!(p.images.length > 0)) {
                _context8.next = 16;
                break;
              }
              _context8.next = 14;
              return this.createImageAssets(product);
            case 14:
              imageLinks = _context8.sent;
              if (imageLinks) {
                fields.images = {
                  "en-US": imageLinks
                };
              }
            case 16:
              if (!p.thumbnail) {
                _context8.next = 24;
                break;
              }
              _context8.next = 19;
              return environment.createAsset({
                fields: {
                  title: {
                    "en-US": "".concat(p.title)
                  },
                  description: {
                    "en-US": ""
                  },
                  file: {
                    "en-US": {
                      contentType: "image/xyz",
                      fileName: p.thumbnail,
                      upload: p.thumbnail
                    }
                  }
                }
              });
            case 19:
              thumbnailAsset = _context8.sent;
              _context8.next = 22;
              return thumbnailAsset.processForAllLocales().then(function (a) {
                return a.publish();
              });
            case 22:
              thumbnailLink = {
                sys: {
                  type: "Link",
                  linkType: "Asset",
                  id: thumbnailAsset.sys.id
                }
              };
              fields.thumbnail = {
                "en-US": thumbnailLink
              };
            case 24:
              _context8.next = 26;
              return this.createSpecialProductFields(fields, p);
            case 26:
              _context8.next = 28;
              return environment.createEntryWithId("product", p.id, {
                fields: fields
              });
            case 28:
              result = _context8.sent;
              return _context8.abrupt("return", result);
            case 30:
            case "end":
              return _context8.stop();
          }
        }, _callee8, this);
      }));
      function createProductInContentful(_x10) {
        return _createProductInContentful.apply(this, arguments);
      }
      return createProductInContentful;
    }()
  }, {
    key: "createProductVariantInContentful",
    value: function () {
      var _createProductVariantInContentful = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(variant) {
        var _fields2;
        var v, sku, _yield$this$productVa, _yield$this$productVa2, inventoryItem, environment, result;
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return this.productVariantService_.retrieve(variant.id, {
                relations: ["prices", "options"]
              });
            case 2:
              v = _context9.sent;
              sku = v.sku;
              if (!this.featureFlagRouter_.isFeatureEnabled("inventoryService")) {
                _context9.next = 11;
                break;
              }
              _context9.next = 7;
              return this.productVariantInventoryService_.listInventoryItemsByVariant(v.id);
            case 7:
              _yield$this$productVa = _context9.sent;
              _yield$this$productVa2 = _slicedToArray(_yield$this$productVa, 1);
              inventoryItem = _yield$this$productVa2[0];
              if (inventoryItem) {
                sku = inventoryItem.sku;
              }
            case 11:
              _context9.next = 13;
              return this.getContentfulEnvironment_();
            case 13:
              environment = _context9.sent;
              _context9.next = 16;
              return environment.createEntryWithId("productVariant", v.id, {
                fields: (_fields2 = {}, _defineProperty(_fields2, this.getCustomField("title", "variant"), {
                  "en-US": v.title
                }), _defineProperty(_fields2, this.getCustomField("sku", "variant"), {
                  "en-US": sku
                }), _defineProperty(_fields2, this.getCustomField("prices", "variant"), {
                  "en-US": this.transformMedusaIds(v.prices)
                }), _defineProperty(_fields2, this.getCustomField("options", "variant"), {
                  "en-US": this.transformMedusaIds(v.options)
                }), _defineProperty(_fields2, this.getCustomField("medusaId", "variant"), {
                  "en-US": v.id
                }), _fields2)
              });
            case 16:
              result = _context9.sent;
              return _context9.abrupt("return", result);
            case 18:
            case "end":
              return _context9.stop();
          }
        }, _callee9, this);
      }));
      function createProductVariantInContentful(_x11) {
        return _createProductVariantInContentful.apply(this, arguments);
      }
      return createProductVariantInContentful;
    }()
  }, {
    key: "createRegionInContentful",
    value: function () {
      var _createRegionInContentful = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(region) {
        var _fields3;
        var hasType, r, environment, fields, result;
        return _regeneratorRuntime().wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return this.getType("region").then(function () {
                return true;
              })["catch"](function () {
                return false;
              });
            case 2:
              hasType = _context10.sent;
              if (hasType) {
                _context10.next = 5;
                break;
              }
              return _context10.abrupt("return", Promise.resolve());
            case 5:
              _context10.next = 7;
              return this.regionService_.retrieve(region.id, {
                relations: ["countries", "payment_providers", "fulfillment_providers"]
              });
            case 7:
              r = _context10.sent;
              _context10.next = 10;
              return this.getContentfulEnvironment_();
            case 10:
              environment = _context10.sent;
              fields = (_fields3 = {}, _defineProperty(_fields3, this.getCustomField("medusaId", "region"), {
                "en-US": r.id
              }), _defineProperty(_fields3, this.getCustomField("name", "region"), {
                "en-US": r.name
              }), _defineProperty(_fields3, this.getCustomField("countries", "region"), {
                "en-US": r.countries
              }), _defineProperty(_fields3, this.getCustomField("paymentProviders", "region"), {
                "en-US": r.payment_providers
              }), _defineProperty(_fields3, this.getCustomField("fulfillmentProviders", "region"), {
                "en-US": r.fulfillment_providers
              }), _fields3);
              _context10.next = 14;
              return environment.createEntryWithId("region", r.id, {
                fields: fields
              });
            case 14:
              result = _context10.sent;
              return _context10.abrupt("return", result);
            case 16:
            case "end":
              return _context10.stop();
          }
        }, _callee10, this);
      }));
      function createRegionInContentful(_x12) {
        return _createRegionInContentful.apply(this, arguments);
      }
      return createRegionInContentful;
    }()
  }, {
    key: "updateRegionInContentful",
    value: function () {
      var _updateRegionInContentful = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(data) {
        var _objectSpread2;
        var hasType, updateFields, found, ignore, r, environment, regionEntry, regionEntryFields, updatedEntry, publishedEntry;
        return _regeneratorRuntime().wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return this.getType("region").then(function () {
                return true;
              })["catch"](function () {
                return false;
              });
            case 2:
              hasType = _context11.sent;
              if (hasType) {
                _context11.next = 5;
                break;
              }
              return _context11.abrupt("return", Promise.resolve());
            case 5:
              updateFields = ["name", "currency_code", "countries", "payment_providers", "fulfillment_providers"];
              found = data.fields.find(function (f) {
                return updateFields.includes(f);
              });
              if (found) {
                _context11.next = 9;
                break;
              }
              return _context11.abrupt("return");
            case 9:
              _context11.next = 11;
              return this.shouldIgnore_(data.id, "contentful");
            case 11:
              ignore = _context11.sent;
              if (!ignore) {
                _context11.next = 14;
                break;
              }
              return _context11.abrupt("return");
            case 14:
              _context11.next = 16;
              return this.regionService_.retrieve(data.id, {
                relations: ["countries", "payment_providers", "fulfillment_providers"]
              });
            case 16:
              r = _context11.sent;
              _context11.next = 19;
              return this.getContentfulEnvironment_();
            case 19:
              environment = _context11.sent;
              // check if region exists
              regionEntry = undefined;
              _context11.prev = 21;
              _context11.next = 24;
              return environment.getEntry(data.id);
            case 24:
              regionEntry = _context11.sent;
              _context11.next = 30;
              break;
            case 27:
              _context11.prev = 27;
              _context11.t0 = _context11["catch"](21);
              return _context11.abrupt("return", this.createRegionInContentful(r));
            case 30:
              regionEntryFields = _objectSpread(_objectSpread({}, regionEntry.fields), {}, (_objectSpread2 = {}, _defineProperty(_objectSpread2, this.getCustomField("name", "region"), {
                "en-US": r.name
              }), _defineProperty(_objectSpread2, this.getCustomField("countries", "region"), {
                "en-US": r.countries
              }), _defineProperty(_objectSpread2, this.getCustomField("paymentProviders", "region"), {
                "en-US": r.payment_providers
              }), _defineProperty(_objectSpread2, this.getCustomField("fulfillmentProviders", "region"), {
                "en-US": r.fulfillment_providers
              }), _objectSpread2));
              regionEntry.fields = regionEntryFields;
              _context11.next = 34;
              return regionEntry.update();
            case 34:
              updatedEntry = _context11.sent;
              _context11.next = 37;
              return updatedEntry.publish();
            case 37:
              publishedEntry = _context11.sent;
              _context11.next = 40;
              return this.addIgnore_(data.id, "medusa");
            case 40:
              return _context11.abrupt("return", publishedEntry);
            case 41:
            case "end":
              return _context11.stop();
          }
        }, _callee11, this, [[21, 27]]);
      }));
      function updateRegionInContentful(_x13) {
        return _updateRegionInContentful.apply(this, arguments);
      }
      return updateRegionInContentful;
    }()
  }, {
    key: "createCollectionInContentful",
    value: function () {
      var _createCollectionInContentful = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(collection) {
        var _fields4;
        var hasType, environment, fields, result;
        return _regeneratorRuntime().wrap(function _callee12$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return this.getType("collection").then(function () {
                return true;
              })["catch"](function () {
                return false;
              });
            case 2:
              hasType = _context12.sent;
              if (hasType) {
                _context12.next = 5;
                break;
              }
              return _context12.abrupt("return", Promise.resolve());
            case 5:
              _context12.next = 7;
              return this.getContentfulEnvironment_();
            case 7:
              environment = _context12.sent;
              fields = (_fields4 = {}, _defineProperty(_fields4, this.getCustomField("medusaId", "collection"), {
                "en-US": collection.id
              }), _defineProperty(_fields4, this.getCustomField("title", "collection"), {
                "en-US": collection.title
              }), _fields4);
              _context12.next = 11;
              return environment.createEntryWithId("collection", collection.id, {
                fields: fields
              });
            case 11:
              result = _context12.sent;
              return _context12.abrupt("return", result);
            case 13:
            case "end":
              return _context12.stop();
          }
        }, _callee12, this);
      }));
      function createCollectionInContentful(_x14) {
        return _createCollectionInContentful.apply(this, arguments);
      }
      return createCollectionInContentful;
    }()
  }, {
    key: "createTypeInContentful",
    value: function () {
      var _createTypeInContentful = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(type) {
        var _fields5;
        var hasType, environment, fields, result;
        return _regeneratorRuntime().wrap(function _callee13$(_context13) {
          while (1) switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return this.getType("productType").then(function () {
                return true;
              })["catch"](function () {
                return false;
              });
            case 2:
              hasType = _context13.sent;
              if (hasType) {
                _context13.next = 5;
                break;
              }
              return _context13.abrupt("return", Promise.resolve());
            case 5:
              _context13.next = 7;
              return this.getContentfulEnvironment_();
            case 7:
              environment = _context13.sent;
              fields = (_fields5 = {}, _defineProperty(_fields5, this.getCustomField("medusaId", "type"), {
                "en-US": type.id
              }), _defineProperty(_fields5, this.getCustomField("name", "type"), {
                "en-US": type.value
              }), _fields5);
              _context13.next = 11;
              return environment.createEntryWithId("productType", type.id, {
                fields: fields
              });
            case 11:
              result = _context13.sent;
              return _context13.abrupt("return", result);
            case 13:
            case "end":
              return _context13.stop();
          }
        }, _callee13, this);
      }));
      function createTypeInContentful(_x15) {
        return _createTypeInContentful.apply(this, arguments);
      }
      return createTypeInContentful;
    }()
  }, {
    key: "upsertTypeEntry",
    value: function () {
      var _upsertTypeEntry = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(type) {
        var hasType, environment, typeEntry, typeEntryFields;
        return _regeneratorRuntime().wrap(function _callee14$(_context14) {
          while (1) switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return this.getType("productType").then(function () {
                return true;
              })["catch"](function () {
                return false;
              });
            case 2:
              hasType = _context14.sent;
              if (hasType) {
                _context14.next = 5;
                break;
              }
              return _context14.abrupt("return", Promise.resolve());
            case 5:
              _context14.next = 7;
              return this.getContentfulEnvironment_();
            case 7:
              environment = _context14.sent;
              // check if type exists
              typeEntry = undefined;
              _context14.prev = 9;
              _context14.next = 12;
              return environment.getEntry(type.id);
            case 12:
              typeEntry = _context14.sent;
              _context14.next = 18;
              break;
            case 15:
              _context14.prev = 15;
              _context14.t0 = _context14["catch"](9);
              return _context14.abrupt("return", this.createTypeInContentful(type));
            case 18:
              typeEntryFields = _objectSpread(_objectSpread({}, typeEntry.fields), {}, _defineProperty({}, this.getCustomField("name", "type"), {
                "en-US": type.value
              }));
              typeEntry.fields = typeEntryFields;
              _context14.next = 22;
              return typeEntry.update();
            case 22:
              return _context14.abrupt("return", _context14.sent);
            case 23:
            case "end":
              return _context14.stop();
          }
        }, _callee14, this, [[9, 15]]);
      }));
      function upsertTypeEntry(_x16) {
        return _upsertTypeEntry.apply(this, arguments);
      }
      return upsertTypeEntry;
    }()
  }, {
    key: "upsertCollectionEntry",
    value: function () {
      var _upsertCollectionEntry = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15(collection) {
        var hasType, environment, collectionEntry, collectionEntryFields;
        return _regeneratorRuntime().wrap(function _callee15$(_context15) {
          while (1) switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return this.getType("collection").then(function () {
                return true;
              })["catch"](function () {
                return false;
              });
            case 2:
              hasType = _context15.sent;
              if (hasType) {
                _context15.next = 5;
                break;
              }
              return _context15.abrupt("return", Promise.resolve());
            case 5:
              _context15.next = 7;
              return this.getContentfulEnvironment_();
            case 7:
              environment = _context15.sent;
              // check if collection exists
              collectionEntry = undefined;
              _context15.prev = 9;
              _context15.next = 12;
              return environment.getEntry(collection.id);
            case 12:
              collectionEntry = _context15.sent;
              _context15.next = 18;
              break;
            case 15:
              _context15.prev = 15;
              _context15.t0 = _context15["catch"](9);
              return _context15.abrupt("return", this.createCollectionInContentful(collection));
            case 18:
              collectionEntryFields = _objectSpread(_objectSpread({}, collectionEntry.fields), {}, _defineProperty({}, this.getCustomField("title", "collection"), {
                "en-US": collection.title
              }));
              collectionEntry.fields = collectionEntryFields;
              _context15.next = 22;
              return collectionEntry.update();
            case 22:
              return _context15.abrupt("return", _context15.sent);
            case 23:
            case "end":
              return _context15.stop();
          }
        }, _callee15, this, [[9, 15]]);
      }));
      function upsertCollectionEntry(_x17) {
        return _upsertCollectionEntry.apply(this, arguments);
      }
      return upsertCollectionEntry;
    }()
  }, {
    key: "updateProductInContentful",
    value: function () {
      var _updateProductInContentful = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee16(data) {
        var _objectSpread5;
        var updateFields, found, ignore, p, environment, productEntry, variantEntries, variantLinks, productEntryFields, url, thumbnailAsset, thumbnailLink, updatedEntry, publishedEntry;
        return _regeneratorRuntime().wrap(function _callee16$(_context16) {
          while (1) switch (_context16.prev = _context16.next) {
            case 0:
              updateFields = ["variants", "options", "tags", "title", "subtitle", "tags", "type", "type_id", "collection", "collection_id", "thumbnail"];
              found = data.fields.find(function (f) {
                return updateFields.includes(f);
              });
              if (found) {
                _context16.next = 4;
                break;
              }
              return _context16.abrupt("return", Promise.resolve());
            case 4:
              _context16.next = 6;
              return this.shouldIgnore_(data.id, "contentful");
            case 6:
              ignore = _context16.sent;
              if (!ignore) {
                _context16.next = 9;
                break;
              }
              return _context16.abrupt("return", Promise.resolve());
            case 9:
              _context16.next = 11;
              return this.productService_.retrieve(data.id, {
                relations: ["options", "variants", "type", "collection", "tags", "images"]
              });
            case 11:
              p = _context16.sent;
              _context16.next = 14;
              return this.getContentfulEnvironment_();
            case 14:
              environment = _context16.sent;
              // check if product exists
              productEntry = undefined;
              _context16.prev = 16;
              _context16.next = 19;
              return environment.getEntry(data.id);
            case 19:
              productEntry = _context16.sent;
              _context16.next = 25;
              break;
            case 22:
              _context16.prev = 22;
              _context16.t0 = _context16["catch"](16);
              return _context16.abrupt("return", this.createProductInContentful(p));
            case 25:
              _context16.next = 27;
              return this.getVariantEntries_(p.variants);
            case 27:
              variantEntries = _context16.sent;
              variantLinks = this.getVariantLinks_(variantEntries);
              productEntryFields = _objectSpread(_objectSpread({}, productEntry.fields), {}, (_objectSpread5 = {}, _defineProperty(_objectSpread5, this.getCustomField("title", "product"), {
                "en-US": p.title
              }), _defineProperty(_objectSpread5, this.getCustomField("subtitle", "product"), {
                "en-US": p.subtitle
              }), _defineProperty(_objectSpread5, this.getCustomField("description", "product"), {
                "en-US": p.description
              }), _defineProperty(_objectSpread5, this.getCustomField("options", "product"), {
                "en-US": this.transformMedusaIds(p.options)
              }), _defineProperty(_objectSpread5, this.getCustomField("variants", "product"), {
                "en-US": variantLinks
              }), _defineProperty(_objectSpread5, this.getCustomField("medusaId", "product"), {
                "en-US": p.id
              }), _objectSpread5));
              if (!(data.fields.includes("thumbnail") && p.thumbnail)) {
                _context16.next = 40;
                break;
              }
              url = p.thumbnail;
              if (p.thumbnail.startsWith("//")) {
                url = "https:".concat(url);
              }
              _context16.next = 35;
              return environment.createAsset({
                fields: {
                  title: {
                    "en-US": "".concat(p.title)
                  },
                  description: {
                    "en-US": ""
                  },
                  file: {
                    "en-US": {
                      contentType: "image/xyz",
                      fileName: url,
                      upload: url
                    }
                  }
                }
              });
            case 35:
              thumbnailAsset = _context16.sent;
              _context16.next = 38;
              return thumbnailAsset.processForAllLocales().then(function (a) {
                return a.publish();
              });
            case 38:
              thumbnailLink = {
                sys: {
                  type: "Link",
                  linkType: "Asset",
                  id: thumbnailAsset.sys.id
                }
              };
              productEntryFields.thumbnail = {
                "en-US": thumbnailLink
              };
            case 40:
              _context16.next = 42;
              return this.createSpecialProductFields(productEntryFields, p);
            case 42:
              productEntry.fields = productEntryFields;
              _context16.next = 45;
              return productEntry.update();
            case 45:
              updatedEntry = _context16.sent;
              _context16.next = 48;
              return updatedEntry.publish();
            case 48:
              publishedEntry = _context16.sent;
              _context16.next = 51;
              return this.addIgnore_(data.id, "medusa");
            case 51:
              return _context16.abrupt("return", publishedEntry);
            case 52:
            case "end":
              return _context16.stop();
          }
        }, _callee16, this, [[16, 22]]);
      }));
      function updateProductInContentful(_x18) {
        return _updateProductInContentful.apply(this, arguments);
      }
      return updateProductInContentful;
    }()
  }, {
    key: "createSpecialProductFields",
    value: function () {
      var _createSpecialProductFields = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee17(fields, p) {
        var capabilities, val, type, _val, collection, tags, handle;
        return _regeneratorRuntime().wrap(function _callee17$(_context17) {
          while (1) switch (_context17.prev = _context17.next) {
            case 0:
              _context17.next = 2;
              return this.checkCapabilities("product");
            case 2:
              capabilities = _context17.sent;
              if (!p.type) {
                _context17.next = 16;
                break;
              }
              if (!capabilities.type) {
                _context17.next = 14;
                break;
              }
              _context17.t0 = this;
              _context17.next = 8;
              return this.upsertTypeEntry(p.type);
            case 8:
              _context17.t1 = _context17.sent;
              _context17.t2 = _context17.t0.getLink_.call(_context17.t0, _context17.t1);
              val = {
                "en-US": _context17.t2
              };
              fields[this.getCustomField("type", "product")] = val;
              _context17.next = 16;
              break;
            case 14:
              type = {
                "en-US": p.type.value
              };
              fields[this.getCustomField("type", "product")] = type;
            case 16:
              if (!p.collection) {
                _context17.next = 29;
                break;
              }
              if (!capabilities.collection) {
                _context17.next = 27;
                break;
              }
              _context17.t3 = this;
              _context17.next = 21;
              return this.upsertCollectionEntry(p.collection);
            case 21:
              _context17.t4 = _context17.sent;
              _context17.t5 = _context17.t3.getLink_.call(_context17.t3, _context17.t4);
              _val = {
                "en-US": _context17.t5
              };
              fields[this.getCustomField("collection", "product")] = _val;
              _context17.next = 29;
              break;
            case 27:
              collection = {
                "en-US": p.collection.title
              };
              fields[this.getCustomField("collection", "product")] = collection;
            case 29:
              if (p.tags) {
                tags = {
                  "en-US": p.tags
                };
                fields[this.getCustomField("tags", "product")] = tags;
              }
              if (p.handle) {
                handle = {
                  "en-US": p.handle
                };
                fields[this.getCustomField("handle", "product")] = handle;
              }
            case 31:
            case "end":
              return _context17.stop();
          }
        }, _callee17, this);
      }));
      function createSpecialProductFields(_x19, _x20) {
        return _createSpecialProductFields.apply(this, arguments);
      }
      return createSpecialProductFields;
    }()
  }, {
    key: "updateProductVariantInContentful",
    value: function () {
      var _updateProductVariantInContentful = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee18(variant) {
        var _objectSpread6;
        var updateFields, found, ignore, environment, variantEntry, v, sku, _yield$this$productVa3, _yield$this$productVa4, inventoryItem, variantEntryFields, updatedEntry, publishedEntry;
        return _regeneratorRuntime().wrap(function _callee18$(_context18) {
          while (1) switch (_context18.prev = _context18.next) {
            case 0:
              updateFields = ["title", "prices", "sku", "material", "weight", "length", "height", "origin_country", "options"]; // Update came directly from product variant service so only act on a couple
              // of fields. When the update comes from the product we want to ensure
              // references are set up correctly so we run through everything.
              if (!variant.fields) {
                _context18.next = 5;
                break;
              }
              found = variant.fields.find(function (f) {
                return updateFields.includes(f);
              });
              if (found) {
                _context18.next = 5;
                break;
              }
              return _context18.abrupt("return", Promise.resolve());
            case 5:
              _context18.next = 7;
              return this.shouldIgnore_(variant.id, "contentful");
            case 7:
              ignore = _context18.sent;
              if (!ignore) {
                _context18.next = 10;
                break;
              }
              return _context18.abrupt("return", Promise.resolve());
            case 10:
              _context18.next = 12;
              return this.getContentfulEnvironment_();
            case 12:
              environment = _context18.sent;
              // check if product exists
              variantEntry = undefined; // if not, we create a new one
              _context18.prev = 14;
              _context18.next = 17;
              return environment.getEntry(variant.id);
            case 17:
              variantEntry = _context18.sent;
              _context18.next = 23;
              break;
            case 20:
              _context18.prev = 20;
              _context18.t0 = _context18["catch"](14);
              return _context18.abrupt("return", this.createProductVariantInContentful(variant));
            case 23:
              _context18.next = 25;
              return this.productVariantService_.retrieve(variant.id, {
                relations: ["prices", "options"]
              });
            case 25:
              v = _context18.sent;
              sku = v.sku;
              if (!this.featureFlagRouter_.isFeatureEnabled("inventoryService")) {
                _context18.next = 34;
                break;
              }
              _context18.next = 30;
              return this.productVariantInventoryService_.listInventoryItemsByVariant(v.id);
            case 30:
              _yield$this$productVa3 = _context18.sent;
              _yield$this$productVa4 = _slicedToArray(_yield$this$productVa3, 1);
              inventoryItem = _yield$this$productVa4[0];
              if (inventoryItem) {
                sku = inventoryItem.sku;
              }
            case 34:
              variantEntryFields = _objectSpread(_objectSpread({}, variantEntry.fields), {}, (_objectSpread6 = {}, _defineProperty(_objectSpread6, this.getCustomField("title", "variant"), {
                "en-US": v.title
              }), _defineProperty(_objectSpread6, this.getCustomField("sku", "variant"), {
                "en-US": sku
              }), _defineProperty(_objectSpread6, this.getCustomField("options", "variant"), {
                "en-US": this.transformMedusaIds(v.options)
              }), _defineProperty(_objectSpread6, this.getCustomField("prices", "variant"), {
                "en-US": this.transformMedusaIds(v.prices)
              }), _defineProperty(_objectSpread6, this.getCustomField("medusaId", "variant"), {
                "en-US": v.id
              }), _objectSpread6));
              variantEntry.fields = variantEntryFields;
              _context18.next = 38;
              return variantEntry.update();
            case 38:
              updatedEntry = _context18.sent;
              _context18.next = 41;
              return updatedEntry.publish();
            case 41:
              publishedEntry = _context18.sent;
              _context18.next = 44;
              return this.addIgnore_(variant.id, "medusa");
            case 44:
              return _context18.abrupt("return", publishedEntry);
            case 45:
            case "end":
              return _context18.stop();
          }
        }, _callee18, this, [[14, 20]]);
      }));
      function updateProductVariantInContentful(_x21) {
        return _updateProductVariantInContentful.apply(this, arguments);
      }
      return updateProductVariantInContentful;
    }()
  }, {
    key: "archiveProductVariantInContentful",
    value: function () {
      var _archiveProductVariantInContentful = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee19(variant) {
        var variantEntity, ignore;
        return _regeneratorRuntime().wrap(function _callee19$(_context19) {
          while (1) switch (_context19.prev = _context19.next) {
            case 0:
              _context19.next = 2;
              return this.shouldIgnore_(variant.id, "contentful");
            case 2:
              ignore = _context19.sent;
              if (!ignore) {
                _context19.next = 5;
                break;
              }
              return _context19.abrupt("return", Promise.resolve());
            case 5:
              _context19.prev = 5;
              _context19.next = 8;
              return this.productVariantService_.retrieve(variant.id);
            case 8:
              variantEntity = _context19.sent;
              _context19.next = 13;
              break;
            case 11:
              _context19.prev = 11;
              _context19.t0 = _context19["catch"](5);
            case 13:
              if (!variantEntity) {
                _context19.next = 15;
                break;
              }
              return _context19.abrupt("return", Promise.resolve());
            case 15:
              _context19.next = 17;
              return this.archiveEntryWidthId(variant.id);
            case 17:
              return _context19.abrupt("return", _context19.sent);
            case 18:
            case "end":
              return _context19.stop();
          }
        }, _callee19, this, [[5, 11]]);
      }));
      function archiveProductVariantInContentful(_x22) {
        return _archiveProductVariantInContentful.apply(this, arguments);
      }
      return archiveProductVariantInContentful;
    }()
  }, {
    key: "archiveProductInContentful",
    value: function () {
      var _archiveProductInContentful = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee20(product) {
        var productEntity, ignore;
        return _regeneratorRuntime().wrap(function _callee20$(_context20) {
          while (1) switch (_context20.prev = _context20.next) {
            case 0:
              _context20.next = 2;
              return this.shouldIgnore_(product.id, "contentful");
            case 2:
              ignore = _context20.sent;
              if (!ignore) {
                _context20.next = 5;
                break;
              }
              return _context20.abrupt("return", Promise.resolve());
            case 5:
              _context20.prev = 5;
              _context20.next = 8;
              return this.productService_.retrieve(product.id);
            case 8:
              productEntity = _context20.sent;
              _context20.next = 13;
              break;
            case 11:
              _context20.prev = 11;
              _context20.t0 = _context20["catch"](5);
            case 13:
              if (!productEntity) {
                _context20.next = 15;
                break;
              }
              return _context20.abrupt("return", Promise.resolve());
            case 15:
              _context20.next = 17;
              return this.archiveEntryWidthId(product.id);
            case 17:
              return _context20.abrupt("return", _context20.sent);
            case 18:
            case "end":
              return _context20.stop();
          }
        }, _callee20, this, [[5, 11]]);
      }));
      function archiveProductInContentful(_x23) {
        return _archiveProductInContentful.apply(this, arguments);
      }
      return archiveProductInContentful;
    }()
  }, {
    key: "archiveRegionInContentful",
    value: function () {
      var _archiveRegionInContentful = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee21(region) {
        var regionEntity, ignore;
        return _regeneratorRuntime().wrap(function _callee21$(_context21) {
          while (1) switch (_context21.prev = _context21.next) {
            case 0:
              _context21.next = 2;
              return this.shouldIgnore_(region.id, "contentful");
            case 2:
              ignore = _context21.sent;
              if (!ignore) {
                _context21.next = 5;
                break;
              }
              return _context21.abrupt("return", Promise.resolve());
            case 5:
              _context21.prev = 5;
              _context21.next = 8;
              return this.regionService_.retrieve(region.id);
            case 8:
              regionEntity = _context21.sent;
              _context21.next = 13;
              break;
            case 11:
              _context21.prev = 11;
              _context21.t0 = _context21["catch"](5);
            case 13:
              if (!regionEntity) {
                _context21.next = 15;
                break;
              }
              return _context21.abrupt("return", Promise.resolve());
            case 15:
              _context21.next = 17;
              return this.archiveEntryWidthId(region.id);
            case 17:
              return _context21.abrupt("return", _context21.sent);
            case 18:
            case "end":
              return _context21.stop();
          }
        }, _callee21, this, [[5, 11]]);
      }));
      function archiveRegionInContentful(_x24) {
        return _archiveRegionInContentful.apply(this, arguments);
      }
      return archiveRegionInContentful;
    }()
  }, {
    key: "archiveEntryWidthId",
    value: function () {
      var _archiveEntryWidthId = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee22(id) {
        var environment, entry, unpublishEntry, archivedEntry;
        return _regeneratorRuntime().wrap(function _callee22$(_context22) {
          while (1) switch (_context22.prev = _context22.next) {
            case 0:
              _context22.next = 2;
              return this.getContentfulEnvironment_();
            case 2:
              environment = _context22.sent;
              // check if product exists
              entry = undefined;
              _context22.prev = 4;
              _context22.next = 7;
              return environment.getEntry(id);
            case 7:
              entry = _context22.sent;
              _context22.next = 13;
              break;
            case 10:
              _context22.prev = 10;
              _context22.t0 = _context22["catch"](4);
              return _context22.abrupt("return", Promise.resolve());
            case 13:
              _context22.next = 15;
              return entry.unpublish();
            case 15:
              unpublishEntry = _context22.sent;
              _context22.next = 18;
              return entry.archive();
            case 18:
              archivedEntry = _context22.sent;
              _context22.next = 21;
              return this.addIgnore_(id, "medusa");
            case 21:
              return _context22.abrupt("return", archivedEntry);
            case 22:
            case "end":
              return _context22.stop();
          }
        }, _callee22, this, [[4, 10]]);
      }));
      function archiveEntryWidthId(_x25) {
        return _archiveEntryWidthId.apply(this, arguments);
      }
      return archiveEntryWidthId;
    }()
  }, {
    key: "sendContentfulProductToAdmin",
    value: function () {
      var _sendContentfulProductToAdmin = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee24(productId) {
        var _productEntry$fields$,
          _productEntry$fields$2,
          _productEntry$fields$3,
          _productEntry$fields$4,
          _this4 = this;
        var ignore, environment, productEntry, product, update, title, subtitle, description, handle, thumb, _product$thumbnail;
        return _regeneratorRuntime().wrap(function _callee24$(_context24) {
          while (1) switch (_context24.prev = _context24.next) {
            case 0:
              _context24.next = 2;
              return this.shouldIgnore_(productId, "medusa");
            case 2:
              ignore = _context24.sent;
              if (!ignore) {
                _context24.next = 5;
                break;
              }
              return _context24.abrupt("return");
            case 5:
              _context24.next = 7;
              return this.getContentfulEnvironment_();
            case 7:
              environment = _context24.sent;
              _context24.next = 10;
              return environment.getEntry(productId);
            case 10:
              productEntry = _context24.sent;
              _context24.next = 13;
              return this.productService_.retrieve(productId, {
                select: ["id", "handle", "title", "subtitle", "description", "thumbnail"]
              });
            case 13:
              product = _context24.sent;
              update = {};
              title = (_productEntry$fields$ = productEntry.fields[this.getCustomField("title", "product")]) === null || _productEntry$fields$ === void 0 ? void 0 : _productEntry$fields$["en-US"];
              subtitle = (_productEntry$fields$2 = productEntry.fields[this.getCustomField("subtitle", "product")]) === null || _productEntry$fields$2 === void 0 ? void 0 : _productEntry$fields$2["en-US"];
              description = (_productEntry$fields$3 = productEntry.fields[this.getCustomField("description", "product")]) === null || _productEntry$fields$3 === void 0 ? void 0 : _productEntry$fields$3["en-US"];
              handle = (_productEntry$fields$4 = productEntry.fields[this.getCustomField("handle", "product")]) === null || _productEntry$fields$4 === void 0 ? void 0 : _productEntry$fields$4["en-US"];
              if (product.title !== title) {
                update.title = title;
              }
              if (product.subtitle !== subtitle) {
                update.subtitle = subtitle;
              }
              if (product.description !== description) {
                update.description = description;
              }
              if (product.handle !== handle) {
                update.handle = handle;
              }

              // Get the thumbnail, if present
              if (!productEntry.fields.thumbnail) {
                _context24.next = 28;
                break;
              }
              _context24.next = 26;
              return environment.getAsset(productEntry.fields.thumbnail["en-US"].sys.id);
            case 26:
              thumb = _context24.sent;
              if (thumb.fields.file["en-US"].url) {
                if (!((_product$thumbnail = product.thumbnail) !== null && _product$thumbnail !== void 0 && _product$thumbnail.includes(thumb.fields.file["en-US"].url))) {
                  update.thumbnail = thumb.fields.file["en-US"].url;
                }
              }
            case 28:
              if (_lodash["default"].isEmpty(update)) {
                _context24.next = 31;
                break;
              }
              _context24.next = 31;
              return this.productService_.update(productId, update).then( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee23() {
                return _regeneratorRuntime().wrap(function _callee23$(_context23) {
                  while (1) switch (_context23.prev = _context23.next) {
                    case 0:
                      _context23.next = 2;
                      return _this4.addIgnore_(productId, "contentful");
                    case 2:
                      return _context23.abrupt("return", _context23.sent);
                    case 3:
                    case "end":
                      return _context23.stop();
                  }
                }, _callee23);
              })));
            case 31:
            case "end":
              return _context24.stop();
          }
        }, _callee24, this);
      }));
      function sendContentfulProductToAdmin(_x26) {
        return _sendContentfulProductToAdmin.apply(this, arguments);
      }
      return sendContentfulProductToAdmin;
    }()
  }, {
    key: "sendContentfulProductVariantToAdmin",
    value: function () {
      var _sendContentfulProductVariantToAdmin = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee26(variantId) {
        var _this5 = this;
        var ignore, environment, variantEntry, updatedVariant;
        return _regeneratorRuntime().wrap(function _callee26$(_context26) {
          while (1) switch (_context26.prev = _context26.next) {
            case 0:
              ignore = this.shouldIgnore_(variantId, "medusa");
              if (!ignore) {
                _context26.next = 3;
                break;
              }
              return _context26.abrupt("return");
            case 3:
              _context26.next = 5;
              return this.getContentfulEnvironment_();
            case 5:
              environment = _context26.sent;
              _context26.next = 8;
              return environment.getEntry(variantId);
            case 8:
              variantEntry = _context26.sent;
              _context26.next = 11;
              return this.productVariantService_.update(variantId, {
                title: variantEntry.fields[this.getCustomField("title", "variant")]["en-US"]
              }).then( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee25() {
                return _regeneratorRuntime().wrap(function _callee25$(_context25) {
                  while (1) switch (_context25.prev = _context25.next) {
                    case 0:
                      _context25.next = 2;
                      return _this5.addIgnore_(variantId, "contentful");
                    case 2:
                      return _context25.abrupt("return", _context25.sent);
                    case 3:
                    case "end":
                      return _context25.stop();
                  }
                }, _callee25);
              })));
            case 11:
              updatedVariant = _context26.sent;
              return _context26.abrupt("return", updatedVariant);
            case 13:
            case "end":
              return _context26.stop();
          }
        }, _callee26, this);
      }));
      function sendContentfulProductVariantToAdmin(_x27) {
        return _sendContentfulProductVariantToAdmin.apply(this, arguments);
      }
      return sendContentfulProductVariantToAdmin;
    }()
  }, {
    key: "transformMedusaIds",
    value: function transformMedusaIds(objOrArray) {
      var input = objOrArray;
      var isArray = true;
      if (!Array.isArray(objOrArray)) {
        input = [objOrArray];
        isArray = false;
      }
      var output = [];
      var _iterator = _createForOfIteratorHelper(input),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var obj = _step.value;
          var transformed = Object.assign({}, obj);
          transformed.medusaId = obj.id;
          output.push(transformed);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (!isArray) {
        return output[0];
      }
      return output;
    }
  }, {
    key: "getType",
    value: function () {
      var _getType = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee27(type) {
        var environment;
        return _regeneratorRuntime().wrap(function _callee27$(_context27) {
          while (1) switch (_context27.prev = _context27.next) {
            case 0:
              _context27.next = 2;
              return this.getContentfulEnvironment_();
            case 2:
              environment = _context27.sent;
              return _context27.abrupt("return", environment.getContentType(type));
            case 4:
            case "end":
              return _context27.stop();
          }
        }, _callee27, this);
      }));
      function getType(_x28) {
        return _getType.apply(this, arguments);
      }
      return getType;
    }()
  }, {
    key: "checkCapabilities",
    value: function () {
      var _checkCapabilities = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee28(type) {
        return _regeneratorRuntime().wrap(function _callee28$(_context28) {
          while (1) switch (_context28.prev = _context28.next) {
            case 0:
              _context28.t0 = type;
              _context28.next = _context28.t0 === "product" ? 3 : 4;
              break;
            case 3:
              return _context28.abrupt("return", this.checkProductCapabilities());
            case 4:
              return _context28.abrupt("return", {});
            case 5:
            case "end":
              return _context28.stop();
          }
        }, _callee28, this);
      }));
      function checkCapabilities(_x29) {
        return _checkCapabilities.apply(this, arguments);
      }
      return checkCapabilities;
    }()
  }, {
    key: "checkProductCapabilities",
    value: function () {
      var _checkProductCapabilities = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee29() {
        var product, capabilities, typeField, collectionField;
        return _regeneratorRuntime().wrap(function _callee29$(_context29) {
          while (1) switch (_context29.prev = _context29.next) {
            case 0:
              if (!this.capab_["product"]) {
                _context29.next = 2;
                break;
              }
              return _context29.abrupt("return", this.capab_["product"]);
            case 2:
              _context29.next = 4;
              return this.getType("product");
            case 4:
              product = _context29.sent;
              capabilities = {
                collection: false,
                type: false
              };
              if (product.fields) {
                typeField = product.fields.find(function (f) {
                  return f.id === "type";
                });
                if (typeField) {
                  capabilities.type = typeField.linkType === "Entry";
                }
                collectionField = product.fields.find(function (f) {
                  return f.id === "collection";
                });
                if (collectionField) {
                  capabilities.collection = collectionField.linkType === "Entry";
                }
              }
              this.capab_["product"] = capabilities;
              return _context29.abrupt("return", capabilities);
            case 9:
            case "end":
              return _context29.stop();
          }
        }, _callee29, this);
      }));
      function checkProductCapabilities() {
        return _checkProductCapabilities.apply(this, arguments);
      }
      return checkProductCapabilities;
    }()
  }]);
  return ContentfulService;
}(_medusaInterfaces.BaseService);
var _default = ContentfulService;
exports["default"] = _default;