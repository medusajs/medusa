"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = require("@medusajs/medusa/dist/utils");

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && _instanceof(outerFn.prototype, Generator) ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var signature, event, stripeProviderService, isPaymentCollection, handleCartPayments, _handleCartPayments, handlePaymentCollection, _handlePaymentCollection, paymentIntent, cartId, resourceId;

    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _handlePaymentCollection = function _handlePaymentCollect2() {
              _handlePaymentCollection = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(event, req, res, id, paymentIntentId) {
                var _paycol$payments;

                var manager, paymentCollectionService, paycol, payment;
                return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        manager = req.scope.resolve("manager");
                        paymentCollectionService = req.scope.resolve("paymentCollectionService");
                        _context5.next = 4;
                        return paymentCollectionService.retrieve(id, {
                          relations: ["payments"]
                        })["catch"](function () {
                          return undefined;
                        });

                      case 4:
                        paycol = _context5.sent;

                        if (!(paycol !== null && paycol !== void 0 && (_paycol$payments = paycol.payments) !== null && _paycol$payments !== void 0 && _paycol$payments.length)) {
                          _context5.next = 13;
                          break;
                        }

                        if (!(event.type === "payment_intent.succeeded")) {
                          _context5.next = 13;
                          break;
                        }

                        payment = paycol.payments.find(function (pay) {
                          return pay.data.id === paymentIntentId;
                        });

                        if (!(payment && !payment.captured_at)) {
                          _context5.next = 11;
                          break;
                        }

                        _context5.next = 11;
                        return manager.transaction( /*#__PURE__*/function () {
                          var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(manager) {
                            return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                              while (1) {
                                switch (_context4.prev = _context4.next) {
                                  case 0:
                                    _context4.next = 2;
                                    return paymentCollectionService.withTransaction(manager).capture(payment.id);

                                  case 2:
                                  case "end":
                                    return _context4.stop();
                                }
                              }
                            }, _callee4);
                          }));

                          return function (_x14) {
                            return _ref4.apply(this, arguments);
                          };
                        }());

                      case 11:
                        res.sendStatus(200);
                        return _context5.abrupt("return");

                      case 13:
                        res.sendStatus(204);

                      case 14:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));
              return _handlePaymentCollection.apply(this, arguments);
            };

            handlePaymentCollection = function _handlePaymentCollect(_x7, _x8, _x9, _x10, _x11) {
              return _handlePaymentCollection.apply(this, arguments);
            };

            _handleCartPayments = function _handleCartPayments3() {
              _handleCartPayments = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(event, req, res, cartId) {
                var manager, orderService, order, _err$detail, message, _err$detail2;

                return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        manager = req.scope.resolve("manager");
                        orderService = req.scope.resolve("orderService");
                        _context3.next = 4;
                        return orderService.retrieveByCartId(cartId)["catch"](function () {
                          return undefined;
                        });

                      case 4:
                        order = _context3.sent;
                        _context3.t0 = event.type;
                        _context3.next = _context3.t0 === "payment_intent.succeeded" ? 8 : _context3.t0 === "payment_intent.amount_capturable_updated" ? 19 : 31;
                        break;

                      case 8:
                        if (!order) {
                          _context3.next = 17;
                          break;
                        }

                        if (!(order.payment_status !== "captured")) {
                          _context3.next = 14;
                          break;
                        }

                        _context3.next = 12;
                        return manager.transaction( /*#__PURE__*/function () {
                          var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(manager) {
                            return _regeneratorRuntime().wrap(function _callee$(_context) {
                              while (1) {
                                switch (_context.prev = _context.next) {
                                  case 0:
                                    _context.next = 2;
                                    return orderService.withTransaction(manager).capturePayment(order.id);

                                  case 2:
                                  case "end":
                                    return _context.stop();
                                }
                              }
                            }, _callee);
                          }));

                          return function (_x12) {
                            return _ref2.apply(this, arguments);
                          };
                        }());

                      case 12:
                        _context3.next = 15;
                        break;

                      case 14:
                        return _context3.abrupt("return", res.sendStatus(200));

                      case 15:
                        _context3.next = 18;
                        break;

                      case 17:
                        return _context3.abrupt("return", res.sendStatus(404));

                      case 18:
                        return _context3.abrupt("break", 33);

                      case 19:
                        _context3.prev = 19;
                        _context3.next = 22;
                        return manager.transaction( /*#__PURE__*/function () {
                          var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(manager) {
                            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                              while (1) {
                                switch (_context2.prev = _context2.next) {
                                  case 0:
                                    _context2.next = 2;
                                    return paymentIntentAmountCapturableEventHandler({
                                      order: order,
                                      cartId: cartId,
                                      container: req.scope,
                                      transactionManager: manager
                                    });

                                  case 2:
                                  case "end":
                                    return _context2.stop();
                                }
                              }
                            }, _callee2);
                          }));

                          return function (_x13) {
                            return _ref3.apply(this, arguments);
                          };
                        }());

                      case 22:
                        _context3.next = 30;
                        break;

                      case 24:
                        _context3.prev = 24;
                        _context3.t1 = _context3["catch"](19);
                        message = "Stripe webhook ".concat(event, " handling failed\n").concat((_err$detail = _context3.t1 === null || _context3.t1 === void 0 ? void 0 : _context3.t1.detail) !== null && _err$detail !== void 0 ? _err$detail : _context3.t1 === null || _context3.t1 === void 0 ? void 0 : _context3.t1.message);

                        if ((_context3.t1 === null || _context3.t1 === void 0 ? void 0 : _context3.t1.code) === _utils.PostgresError.SERIALIZATION_FAILURE) {
                          message = "Stripe webhook ".concat(event, " handle failed. This can happen when this webhook is triggered during a cart completion and can be ignored. This event should be retried automatically.\n").concat((_err$detail2 = _context3.t1 === null || _context3.t1 === void 0 ? void 0 : _context3.t1.detail) !== null && _err$detail2 !== void 0 ? _err$detail2 : _context3.t1 === null || _context3.t1 === void 0 ? void 0 : _context3.t1.message);
                        }

                        this.logger_.warn(message);
                        return _context3.abrupt("return", res.sendStatus(409));

                      case 30:
                        return _context3.abrupt("break", 33);

                      case 31:
                        res.sendStatus(204);
                        return _context3.abrupt("return");

                      case 33:
                        res.sendStatus(200);

                      case 34:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, this, [[19, 24]]);
              }));
              return _handleCartPayments.apply(this, arguments);
            };

            handleCartPayments = function _handleCartPayments2(_x3, _x4, _x5, _x6) {
              return _handleCartPayments.apply(this, arguments);
            };

            isPaymentCollection = function _isPaymentCollection(id) {
              return id && id.startsWith("paycol");
            };

            signature = req.headers["stripe-signature"];
            _context6.prev = 6;
            stripeProviderService = req.scope.resolve("pp_stripe");
            event = stripeProviderService.constructWebhookEvent(req.body, signature);
            _context6.next = 15;
            break;

          case 11:
            _context6.prev = 11;
            _context6.t0 = _context6["catch"](6);
            res.status(400).send("Webhook Error: ".concat(_context6.t0.message));
            return _context6.abrupt("return");

          case 15:
            paymentIntent = event.data.object;
            cartId = paymentIntent.metadata.cart_id; // Backward compatibility

            resourceId = paymentIntent.metadata.resource_id;

            if (!isPaymentCollection(resourceId)) {
              _context6.next = 23;
              break;
            }

            _context6.next = 21;
            return handlePaymentCollection(event, req, res, resourceId, paymentIntent.id);

          case 21:
            _context6.next = 25;
            break;

          case 23:
            _context6.next = 25;
            return handleCartPayments(event, req, res, cartId !== null && cartId !== void 0 ? cartId : resourceId);

          case 25:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[6, 11]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;

function paymentIntentAmountCapturableEventHandler(_x15) {
  return _paymentIntentAmountCapturableEventHandler.apply(this, arguments);
}

function _paymentIntentAmountCapturableEventHandler() {
  _paymentIntentAmountCapturableEventHandler = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(_ref5) {
    var order, cartId, container, transactionManager, cartService, orderService, cartServiceTx;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            order = _ref5.order, cartId = _ref5.cartId, container = _ref5.container, transactionManager = _ref5.transactionManager;

            if (order) {
              _context7.next = 11;
              break;
            }

            cartService = container.resolve("cartService");
            orderService = container.resolve("orderService");
            cartServiceTx = cartService.withTransaction(transactionManager);
            _context7.next = 7;
            return cartServiceTx.setPaymentSession(cartId, "stripe");

          case 7:
            _context7.next = 9;
            return cartServiceTx.authorizePayment(cartId);

          case 9:
            _context7.next = 11;
            return orderService.withTransaction(transactionManager).createFromCart(cartId);

          case 11:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _paymentIntentAmountCapturableEventHandler.apply(this, arguments);
}