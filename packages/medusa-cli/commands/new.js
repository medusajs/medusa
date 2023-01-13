"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newStarter = void 0;

var _child_process = require("child_process");

var _execa = _interopRequireDefault(require("execa"));

var _fsExistsCached = require("fs-exists-cached");

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _hostedGitInfo = _interopRequireDefault(require("hosted-git-info"));

var _isValidPath = _interopRequireDefault(require("is-valid-path"));

var _path = _interopRequireDefault(require("path"));

var _prompts = _interopRequireDefault(require("prompts"));

var _pg = require("pg");

var _url = _interopRequireDefault(require("url"));

var _pgGod = require("pg-god");

var _medusaTelemetry = require("medusa-telemetry");

var _inquirer = _interopRequireDefault(require("inquirer"));

var _reporter = _interopRequireDefault(require("../reporter"));

var _packageManager = require("../util/package-manager");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var removeUndefined = function removeUndefined(obj) {
  return Object.fromEntries(Object.entries(obj).filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        _ = _ref2[0],
        v = _ref2[1];

    return v != null;
  }).map(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        k = _ref4[0],
        v = _ref4[1];

    return [k, v === Object(v) ? removeEmpty(v) : v];
  }));
};

var spawnWithArgs = function spawnWithArgs(file, args, options) {
  return (0, _execa["default"])(file, args, _objectSpread({
    stdio: "inherit",
    preferLocal: false
  }, options));
};

var spawn = function spawn(cmd, options) {
  var _cmd$split = cmd.split(/\s+/),
      _cmd$split2 = _toArray(_cmd$split),
      file = _cmd$split2[0],
      args = _cmd$split2.slice(1);

  return spawnWithArgs(file, args, options);
}; // Checks the existence of yarn package
// We use yarnpkg instead of yarn to avoid conflict with Hadoop yarn
// Refer to https://github.com/yarnpkg/yarn/issues/673


var checkForYarn = function checkForYarn() {
  try {
    (0, _child_process.execSync)("yarnpkg --version", {
      stdio: "ignore"
    });
    return true;
  } catch (e) {
    return false;
  }
};

var isAlreadyGitRepository = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return spawn("git rev-parse --is-inside-work-tree", {
              stdio: "pipe"
            }).then(function (output) {
              return output.stdout === "true";
            });

          case 3:
            return _context.abrupt("return", _context.sent);

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", false);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 6]]);
  }));

  return function isAlreadyGitRepository() {
    return _ref5.apply(this, arguments);
  };
}(); // Initialize newly cloned directory as a git repo


var gitInit = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(rootPath) {
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _reporter["default"].info("Initialising git in ".concat(rootPath));

            _context2.next = 3;
            return spawn("git init", {
              cwd: rootPath
            });

          case 3:
            return _context2.abrupt("return", _context2.sent);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function gitInit(_x) {
    return _ref6.apply(this, arguments);
  };
}(); // Create a .gitignore file if it is missing in the new directory


var maybeCreateGitIgnore = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(rootPath) {
    var gignore;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(0, _fsExistsCached.sync)(_path["default"].join(rootPath, ".gitignore"))) {
              _context3.next = 2;
              break;
            }

            return _context3.abrupt("return");

          case 2:
            gignore = _reporter["default"].activity("Creating minimal .gitignore in ".concat(rootPath));
            _context3.next = 5;
            return _fsExtra["default"].writeFile(_path["default"].join(rootPath, ".gitignore"), ".cache\nnode_modules\npublic\n");

          case 5:
            _reporter["default"].success(gignore, "Created .gitignore in ".concat(rootPath));

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function maybeCreateGitIgnore(_x2) {
    return _ref7.apply(this, arguments);
  };
}(); // Create an initial git commit in the new directory


var createInitialGitCommit = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(rootPath, starterUrl) {
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _reporter["default"].info("Create initial git commit in ".concat(rootPath));

            _context4.next = 3;
            return spawn("git add -A", {
              cwd: rootPath
            });

          case 3:
            // use execSync instead of spawn to handle git clients using
            // pgp signatures (with password)
            try {
              (0, _child_process.execSync)("git commit -m \"Initial commit from medusa: (".concat(starterUrl, ")\""), {
                cwd: rootPath
              });
            } catch (_unused) {
              // Remove git support if initial commit fails
              _reporter["default"].warn("Initial git commit failed - removing git support\n");

              _fsExtra["default"].removeSync(_path["default"].join(rootPath, ".git"));
            }

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function createInitialGitCommit(_x3, _x4) {
    return _ref8.apply(this, arguments);
  };
}(); // Executes `npm install` or `yarn install` in rootPath.


var install = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(rootPath) {
    var prevDir, npmConfigUserAgent;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            prevDir = process.cwd();

            _reporter["default"].info("Installing packages...");

            console.log(); // Add some space

            process.chdir(rootPath);
            npmConfigUserAgent = process.env.npm_config_user_agent;
            _context5.prev = 5;

            if (!(0, _packageManager.getPackageManager)()) {
              if (npmConfigUserAgent !== null && npmConfigUserAgent !== void 0 && npmConfigUserAgent.includes("yarn")) {
                (0, _packageManager.setPackageManager)("yarn");
              } else {
                (0, _packageManager.setPackageManager)("npm");
              }
            }

            if (!((0, _packageManager.getPackageManager)() === "yarn" && checkForYarn())) {
              _context5.next = 14;
              break;
            }

            _context5.next = 10;
            return _fsExtra["default"].remove("package-lock.json");

          case 10:
            _context5.next = 12;
            return spawn("yarnpkg");

          case 12:
            _context5.next = 18;
            break;

          case 14:
            _context5.next = 16;
            return _fsExtra["default"].remove("yarn.lock");

          case 16:
            _context5.next = 18;
            return spawn("npm install");

          case 18:
            _context5.prev = 18;
            process.chdir(prevDir);
            return _context5.finish(18);

          case 21:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[5,, 18, 21]]);
  }));

  return function install(_x5) {
    return _ref9.apply(this, arguments);
  };
}();

var ignored = function ignored(path) {
  return !/^\.(git|hg)$/.test(_path["default"].basename(path));
}; // Copy starter from file system.


var copy = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(starterPath, rootPath) {
    var copyActivity;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return _fsExtra["default"].ensureDir(rootPath, {
              mode: 493
            });

          case 2:
            if ((0, _fsExistsCached.sync)(starterPath)) {
              _context6.next = 4;
              break;
            }

            throw new Error("starter ".concat(starterPath, " doesn't exist"));

          case 4:
            if (!(starterPath === ".")) {
              _context6.next = 6;
              break;
            }

            throw new Error("You can't create a starter from the existing directory. If you want to\n      create a new project in the current directory, the trailing dot isn't\n      necessary. If you want to create a project from a local starter, run\n      something like \"medusa new my-medusa-store ../local-medusa-starter\"");

          case 6:
            _reporter["default"].info("Creating new site from local starter: ".concat(starterPath));

            copyActivity = _reporter["default"].activity("Copying local starter to ".concat(rootPath, " ..."));
            _context6.next = 10;
            return _fsExtra["default"].copy(starterPath, rootPath, {
              filter: ignored
            });

          case 10:
            _reporter["default"].success(copyActivity, "Created starter directory layout");

            console.log(); // Add some space

            _context6.next = 14;
            return install(rootPath);

          case 14:
            return _context6.abrupt("return", true);

          case 15:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function copy(_x6, _x7) {
    return _ref10.apply(this, arguments);
  };
}(); // Clones starter from URI.


var clone = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(hostInfo, rootPath) {
    var url, branch, createAct, args, isGit;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            // Let people use private repos accessed over SSH.
            if (hostInfo.getDefaultRepresentation() === "sshurl") {
              url = hostInfo.ssh({
                noCommittish: true
              }); // Otherwise default to normal git syntax.
            } else {
              url = hostInfo.https({
                noCommittish: true,
                noGitPlus: true
              });
            }

            branch = hostInfo.committish ? ["-b", hostInfo.committish] : [];
            createAct = _reporter["default"].activity("Creating new project from git: ".concat(url));
            args = ["clone"].concat(branch, [url, rootPath, "--recursive", "--depth=1"]).filter(function (arg) {
              return Boolean(arg);
            });
            _context7.next = 6;
            return (0, _execa["default"])("git", args, {}).then(function () {
              _reporter["default"].success(createAct, "Created starter directory layout");
            })["catch"](function (err) {
              _reporter["default"].failure(createAct, "Failed to clone repository");

              throw err;
            });

          case 6:
            _context7.next = 8;
            return _fsExtra["default"].remove(_path["default"].join(rootPath, ".git"));

          case 8:
            _context7.next = 10;
            return install(rootPath);

          case 10:
            _context7.next = 12;
            return isAlreadyGitRepository();

          case 12:
            isGit = _context7.sent;

            if (isGit) {
              _context7.next = 16;
              break;
            }

            _context7.next = 16;
            return gitInit(rootPath);

          case 16:
            _context7.next = 18;
            return maybeCreateGitIgnore(rootPath);

          case 18:
            if (isGit) {
              _context7.next = 21;
              break;
            }

            _context7.next = 21;
            return createInitialGitCommit(rootPath, url);

          case 21:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function clone(_x8, _x9) {
    return _ref11.apply(this, arguments);
  };
}();

var getMedusaConfig = function getMedusaConfig(rootPath) {
  try {
    var configPath = _path["default"].join(rootPath, "medusa-config.js");

    if ((0, _fsExistsCached.sync)(configPath)) {
      var resolved = _path["default"].resolve(configPath);

      var configModule = require(resolved);

      return configModule;
    }

    throw Error();
  } catch (err) {
    console.log(err);

    _reporter["default"].warn("Couldn't find a medusa-config.js file; please double check that you have the correct starter installed");
  }

  return {};
};

var getPaths = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(starterPath, rootPath) {
    var selectedOtherStarter, response;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            selectedOtherStarter = false; // if no args are passed, prompt user for path and starter

            if (!(!starterPath && !rootPath)) {
              _context8.next = 10;
              break;
            }

            _context8.next = 4;
            return _prompts["default"].prompt([{
              type: "text",
              name: "path",
              message: "What is your project called?",
              initial: "my-medusa-store"
            }, {
              type: "select",
              name: "starter",
              message: "What starter would you like to use?",
              choices: [{
                title: "medusa-starter-default",
                value: "medusa-starter-default"
              }, {
                title: "(Use a different starter)",
                value: "different"
              }],
              initial: 0
            }]);

          case 4:
            response = _context8.sent;

            if (!(!response.starter || !response.path.trim())) {
              _context8.next = 7;
              break;
            }

            throw new Error("Please mention both starter package and project name along with path(if its not in the root)");

          case 7:
            selectedOtherStarter = response.starter === "different";
            starterPath = "medusajs/".concat(response.starter);
            rootPath = response.path;

          case 10:
            // set defaults if no root or starter has been set yet
            rootPath = rootPath || process.cwd();
            starterPath = starterPath || "medusajs/medusa-starter-default";
            return _context8.abrupt("return", {
              starterPath: starterPath,
              rootPath: rootPath,
              selectedOtherStarter: selectedOtherStarter
            });

          case 13:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function getPaths(_x10, _x11) {
    return _ref12.apply(this, arguments);
  };
}();

var successMessage = function successMessage(path) {
  _reporter["default"].info("Your new Medusa project is ready for you! To start developing run:\n\n  cd ".concat(path, "\n  medusa develop\n"));
};

var defaultDBCreds = {
  user: process.env.USER || "postgres",
  database: "postgres",
  password: "",
  port: 5432,
  host: "localhost"
};

var verifyPgCreds = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(creds) {
    var pool;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            pool = new _pg.Pool(creds);
            return _context9.abrupt("return", new Promise(function (resolve, reject) {
              pool.query("SELECT NOW()", function (err, res) {
                pool.end();

                if (err) {
                  reject(err);
                } else {
                  resolve(res);
                }
              });
            }));

          case 2:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function verifyPgCreds(_x12) {
    return _ref13.apply(this, arguments);
  };
}();

var interactiveDbCreds = /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(dbName) {
    var dbCreds,
        credentials,
        collecting,
        result,
        _args11 = arguments;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            dbCreds = _args11.length > 1 && _args11[1] !== undefined ? _args11[1] : {};
            credentials = Object.assign({}, defaultDBCreds, dbCreds);
            collecting = true;

          case 3:
            if (!collecting) {
              _context11.next = 12;
              break;
            }

            _context11.next = 6;
            return _inquirer["default"].prompt([{
              type: "list",
              name: "continueWithDefault",
              message: "\n\nWill attempt to setup database \"".concat(dbName, "\" with credentials:\n  user: ").concat(credentials.user, "\n  password: ***\n  database: ").concat(credentials.database, "\n  port: ").concat(credentials.port, "\n  host: ").concat(credentials.host, "\nDo you wish to continue with these credentials?\n\n          "),
              choices: ["Continue", "Change credentials", "Skip database setup"]
            }, {
              type: "input",
              when: function when(_ref15) {
                var continueWithDefault = _ref15.continueWithDefault;
                return continueWithDefault === "Change credentials";
              },
              name: "user",
              "default": credentials.user,
              message: "DB user"
            }, {
              type: "password",
              when: function when(_ref16) {
                var continueWithDefault = _ref16.continueWithDefault;
                return continueWithDefault === "Change credentials";
              },
              name: "password",
              "default": credentials.password,
              message: "DB password"
            }, {
              type: "number",
              when: function when(_ref17) {
                var continueWithDefault = _ref17.continueWithDefault;
                return continueWithDefault === "Change credentials";
              },
              name: "port",
              "default": credentials.port,
              message: "DB port"
            }, {
              type: "input",
              when: function when(_ref18) {
                var continueWithDefault = _ref18.continueWithDefault;
                return continueWithDefault === "Change credentials";
              },
              name: "host",
              "default": credentials.host,
              message: "DB host"
            }, {
              type: "input",
              when: function when(_ref19) {
                var continueWithDefault = _ref19.continueWithDefault;
                return continueWithDefault === "Change credentials";
              },
              name: "database",
              "default": credentials.database,
              message: "DB database"
            }]).then( /*#__PURE__*/function () {
              var _ref20 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(answers) {
                var collectedCreds, done, _done;

                return _regeneratorRuntime().wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        collectedCreds = Object.assign({}, credentials, {
                          user: answers.user,
                          password: answers.password,
                          host: answers.host,
                          port: answers.port,
                          database: answers.database
                        });
                        _context10.t0 = answers.continueWithDefault;
                        _context10.next = _context10.t0 === "Continue" ? 4 : _context10.t0 === "Change credentials" ? 10 : 16;
                        break;

                      case 4:
                        _context10.next = 6;
                        return verifyPgCreds(credentials)["catch"](function (_) {
                          return false;
                        });

                      case 6:
                        done = _context10.sent;

                        if (!done) {
                          _context10.next = 9;
                          break;
                        }

                        return _context10.abrupt("return", credentials);

                      case 9:
                        return _context10.abrupt("return", false);

                      case 10:
                        _context10.next = 12;
                        return verifyPgCreds(collectedCreds)["catch"](function (_) {
                          return false;
                        });

                      case 12:
                        _done = _context10.sent;

                        if (!_done) {
                          _context10.next = 15;
                          break;
                        }

                        return _context10.abrupt("return", collectedCreds);

                      case 15:
                        return _context10.abrupt("return", false);

                      case 16:
                        return _context10.abrupt("return", null);

                      case 17:
                      case "end":
                        return _context10.stop();
                    }
                  }
                }, _callee10);
              }));

              return function (_x14) {
                return _ref20.apply(this, arguments);
              };
            }());

          case 6:
            result = _context11.sent;

            if (!(result !== false)) {
              _context11.next = 9;
              break;
            }

            return _context11.abrupt("return", result);

          case 9:
            console.log("\n\nCould not verify DB credentials - please try again\n\n");
            _context11.next = 3;
            break;

          case 12:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function interactiveDbCreds(_x13) {
    return _ref14.apply(this, arguments);
  };
}();

var setupDB = /*#__PURE__*/function () {
  var _ref21 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(dbName) {
    var dbCreds,
        credentials,
        dbActivity,
        _args12 = arguments;
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            dbCreds = _args12.length > 1 && _args12[1] !== undefined ? _args12[1] : {};
            credentials = Object.assign({}, defaultDBCreds, dbCreds);
            dbActivity = _reporter["default"].activity("Setting up database \"".concat(dbName, "\"..."));
            _context12.next = 5;
            return (0, _pgGod.createDatabase)({
              databaseName: dbName,
              errorIfExist: true
            }, credentials).then(function () {
              _reporter["default"].success(dbActivity, "Created database \"".concat(dbName, "\""));
            })["catch"](function (err) {
              if (err.name === "PDG_ERR::DuplicateDatabase") {
                _reporter["default"].success(dbActivity, "Database ".concat(dbName, " already exists; skipping setup"));
              } else {
                _reporter["default"].failure(dbActivity, "Skipping database setup.");

                _reporter["default"].warn("Failed to setup database; install PostgresQL or make sure to manage your database connection manually");

                console.error(err);
              }
            });

          case 5:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function setupDB(_x15) {
    return _ref21.apply(this, arguments);
  };
}();

var setupEnvVars = /*#__PURE__*/function () {
  var _ref22 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(rootPath, dbName) {
    var dbCreds,
        isPostgres,
        templatePath,
        destination,
        credentials,
        dbUrl,
        _args13 = arguments;
    return _regeneratorRuntime().wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            dbCreds = _args13.length > 2 && _args13[2] !== undefined ? _args13[2] : {};
            isPostgres = _args13.length > 3 && _args13[3] !== undefined ? _args13[3] : true;
            templatePath = _path["default"].join(rootPath, ".env.template");
            destination = _path["default"].join(rootPath, ".env");

            if ((0, _fsExistsCached.sync)(templatePath)) {
              _fsExtra["default"].renameSync(templatePath, destination);
            }

            if (isPostgres) {
              credentials = Object.assign({}, defaultDBCreds, dbCreds);
              dbUrl = "";

              if (credentials.user !== defaultDBCreds.user || credentials.password !== defaultDBCreds.password) {
                dbUrl = "postgres://".concat(credentials.user, ":").concat(credentials.password, "@").concat(credentials.host, ":").concat(credentials.port, "/").concat(dbName);
              } else {
                dbUrl = "postgres://".concat(credentials.host, ":").concat(credentials.port, "/").concat(dbName);
              }

              _fsExtra["default"].appendFileSync(destination, "DATABASE_URL=".concat(dbUrl, "\n"));
            }

          case 6:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function setupEnvVars(_x16, _x17) {
    return _ref22.apply(this, arguments);
  };
}();

var runMigrations = /*#__PURE__*/function () {
  var _ref23 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(rootPath) {
    var migrationActivity, cliPath;
    return _regeneratorRuntime().wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            migrationActivity = _reporter["default"].activity("Applying database migrations...");
            cliPath = _path["default"].join("node_modules", "@medusajs", "medusa-cli", "cli.js");
            _context14.next = 4;
            return (0, _execa["default"])(cliPath, ["migrations", "run"], {
              cwd: rootPath
            }).then(function () {
              _reporter["default"].success(migrationActivity, "Database migrations completed.");
            })["catch"](function (err) {
              _reporter["default"].failure(migrationActivity, "Failed to migrate database you must complete migration manually before starting your server.");

              console.error(err);
            });

          case 4:
            return _context14.abrupt("return", _context14.sent);

          case 5:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));

  return function runMigrations(_x18) {
    return _ref23.apply(this, arguments);
  };
}();

var attemptSeed = /*#__PURE__*/function () {
  var _ref24 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15(rootPath) {
    var seedActivity, pkgPath, pkg, proc;
    return _regeneratorRuntime().wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            seedActivity = _reporter["default"].activity("Seeding database");
            pkgPath = _path["default"].resolve(rootPath, "package.json");

            if (!(0, _fsExistsCached.sync)(pkgPath)) {
              _context15.next = 13;
              break;
            }

            pkg = require(pkgPath);

            if (!(pkg.scripts && pkg.scripts.seed)) {
              _context15.next = 10;
              break;
            }

            proc = (0, _execa["default"])((0, _packageManager.getPackageManager)(), ["run", "seed"], {
              cwd: rootPath
            }); // Useful for development
            // proc.stdout.pipe(process.stdout)

            _context15.next = 8;
            return proc.then(function () {
              _reporter["default"].success(seedActivity, "Seed completed");
            })["catch"](function (err) {
              _reporter["default"].failure(seedActivity, "Failed to complete seed; skipping");

              console.error(err);
            });

          case 8:
            _context15.next = 11;
            break;

          case 10:
            _reporter["default"].failure(seedActivity, "Starter doesn't provide a seed command; skipping.");

          case 11:
            _context15.next = 14;
            break;

          case 13:
            _reporter["default"].failure(seedActivity, "Could not find package.json");

          case 14:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function attemptSeed(_x19) {
    return _ref24.apply(this, arguments);
  };
}();
/**
 * Main function that clones or copies the starter.
 */


var newStarter = /*#__PURE__*/function () {
  var _ref25 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee16(args) {
    var starter, root, skipDb, skipMigrations, skipEnv, seed, useDefaults, dbUser, dbDatabase, dbPass, dbPort, dbHost, dbCredentials, _yield$getPaths, starterPath, rootPath, selectedOtherStarter, urlObject, isStarterAUrl, hostedInfo, medusaConfig, isPostgres, databaseType, creds;

    return _regeneratorRuntime().wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            (0, _medusaTelemetry.track)("CLI_NEW");
            starter = args.starter, root = args.root, skipDb = args.skipDb, skipMigrations = args.skipMigrations, skipEnv = args.skipEnv, seed = args.seed, useDefaults = args.useDefaults, dbUser = args.dbUser, dbDatabase = args.dbDatabase, dbPass = args.dbPass, dbPort = args.dbPort, dbHost = args.dbHost;
            dbCredentials = removeUndefined({
              user: dbUser,
              database: dbDatabase,
              password: dbPass,
              port: dbPort,
              host: dbHost
            });
            _context16.next = 5;
            return getPaths(starter, root);

          case 5:
            _yield$getPaths = _context16.sent;
            starterPath = _yield$getPaths.starterPath;
            rootPath = _yield$getPaths.rootPath;
            selectedOtherStarter = _yield$getPaths.selectedOtherStarter;
            urlObject = _url["default"].parse(rootPath);

            if (!selectedOtherStarter) {
              _context16.next = 13;
              break;
            }

            _reporter["default"].info("Find the url of the Medusa starter you wish to create and run:\n\nmedusa new ".concat(rootPath, " [url-to-starter]\n\n"));

            return _context16.abrupt("return");

          case 13:
            if (!(urlObject.protocol && urlObject.host)) {
              _context16.next = 20;
              break;
            }

            isStarterAUrl = starter && !_url["default"].parse(starter).hostname && !_url["default"].parse(starter).protocol;

            if (!(/medusa-starter/gi.test(rootPath) && isStarterAUrl)) {
              _context16.next = 18;
              break;
            }

            _reporter["default"].panic({
              id: "10000",
              context: {
                starter: starter,
                rootPath: rootPath
              }
            });

            return _context16.abrupt("return");

          case 18:
            _reporter["default"].panic({
              id: "10001",
              context: {
                rootPath: rootPath
              }
            });

            return _context16.abrupt("return");

          case 20:
            if ((0, _isValidPath["default"])(rootPath)) {
              _context16.next = 23;
              break;
            }

            _reporter["default"].panic({
              id: "10002",
              context: {
                path: _path["default"].resolve(rootPath)
              }
            });

            return _context16.abrupt("return");

          case 23:
            if (!(0, _fsExistsCached.sync)(_path["default"].join(rootPath, "package.json"))) {
              _context16.next = 26;
              break;
            }

            _reporter["default"].panic({
              id: "10003",
              context: {
                rootPath: rootPath
              }
            });

            return _context16.abrupt("return");

          case 26:
            hostedInfo = _hostedGitInfo["default"].fromUrl(starterPath);

            if (!hostedInfo) {
              _context16.next = 32;
              break;
            }

            _context16.next = 30;
            return clone(hostedInfo, rootPath);

          case 30:
            _context16.next = 34;
            break;

          case 32:
            _context16.next = 34;
            return copy(starterPath, rootPath);

          case 34:
            medusaConfig = getMedusaConfig(rootPath);
            isPostgres = false;

            if (medusaConfig && medusaConfig.projectConfig) {
              databaseType = medusaConfig.projectConfig.database_type;
              isPostgres = databaseType === "postgres";
            }

            (0, _medusaTelemetry.track)("CLI_NEW_LAYOUT_COMPLETED");
            creds = dbCredentials;

            if (!(isPostgres && !useDefaults && !skipDb && !skipEnv)) {
              _context16.next = 43;
              break;
            }

            _context16.next = 42;
            return interactiveDbCreds(rootPath, dbCredentials);

          case 42:
            creds = _context16.sent;

          case 43:
            if (!(creds === null)) {
              _context16.next = 47;
              break;
            }

            _reporter["default"].info("Skipping automatic database setup");

            _context16.next = 63;
            break;

          case 47:
            if (!(!skipDb && isPostgres)) {
              _context16.next = 51;
              break;
            }

            (0, _medusaTelemetry.track)("CLI_NEW_SETUP_DB");
            _context16.next = 51;
            return setupDB(rootPath, creds);

          case 51:
            if (skipEnv) {
              _context16.next = 55;
              break;
            }

            (0, _medusaTelemetry.track)("CLI_NEW_SETUP_ENV");
            _context16.next = 55;
            return setupEnvVars(rootPath, rootPath, creds, isPostgres);

          case 55:
            if (!(!skipMigrations && isPostgres)) {
              _context16.next = 59;
              break;
            }

            (0, _medusaTelemetry.track)("CLI_NEW_RUN_MIGRATIONS");
            _context16.next = 59;
            return runMigrations(rootPath);

          case 59:
            if (!seed) {
              _context16.next = 63;
              break;
            }

            (0, _medusaTelemetry.track)("CLI_NEW_SEED_DB");
            _context16.next = 63;
            return attemptSeed(rootPath);

          case 63:
            successMessage(rootPath);
            (0, _medusaTelemetry.track)("CLI_NEW_SUCCEEDED");

          case 65:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));

  return function newStarter(_x20) {
    return _ref25.apply(this, arguments);
  };
}();

exports.newStarter = newStarter;