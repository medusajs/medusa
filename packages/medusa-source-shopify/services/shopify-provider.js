"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _medusaInterfaces = require("medusa-interfaces");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ShopifyProviderService = /*#__PURE__*/function (_PaymentService) {
  _inherits(ShopifyProviderService, _PaymentService);

  var _super = _createSuper(ShopifyProviderService);

  function ShopifyProviderService(_ref) {
    _objectDestructuringEmpty(_ref);

    _classCallCheck(this, ShopifyProviderService);

    return _super.call(this);
  }

  _createClass(ShopifyProviderService, [{
    key: "createPayment",
    value: function () {
      var _createPayment = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", {});

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function createPayment(_x) {
        return _createPayment.apply(this, arguments);
      }

      return createPayment;
    }()
  }, {
    key: "getStatus",
    value: function () {
      var _getStatus = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", "authorized");

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function getStatus(_x2) {
        return _getStatus.apply(this, arguments);
      }

      return getStatus;
    }()
  }, {
    key: "getPaymentData",
    value: function () {
      var _getPaymentData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", {});

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function getPaymentData(_x3) {
        return _getPaymentData.apply(this, arguments);
      }

      return getPaymentData;
    }()
  }, {
    key: "authorizePayment",
    value: function () {
      var _authorizePayment = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(_) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", {
                  data: {},
                  status: "authorized"
                });

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function authorizePayment(_x4) {
        return _authorizePayment.apply(this, arguments);
      }

      return authorizePayment;
    }()
  }, {
    key: "updatePaymentData",
    value: function () {
      var _updatePaymentData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(_) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", {});

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function updatePaymentData(_x5) {
        return _updatePaymentData.apply(this, arguments);
      }

      return updatePaymentData;
    }()
  }, {
    key: "updatePayment",
    value: function () {
      var _updatePayment = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(_) {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", {});

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function updatePayment(_x6) {
        return _updatePayment.apply(this, arguments);
      }

      return updatePayment;
    }()
  }, {
    key: "deletePayment",
    value: function () {
      var _deletePayment = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(_) {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt("return", {});

              case 1:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function deletePayment(_x7) {
        return _deletePayment.apply(this, arguments);
      }

      return deletePayment;
    }()
  }, {
    key: "capturePayment",
    value: function () {
      var _capturePayment = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(_) {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return", {});

              case 1:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function capturePayment(_x8) {
        return _capturePayment.apply(this, arguments);
      }

      return capturePayment;
    }()
  }, {
    key: "refundPayment",
    value: function () {
      var _refundPayment = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(payment, refundAmount) {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                return _context9.abrupt("return", payment.data);

              case 1:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function refundPayment(_x9, _x10) {
        return _refundPayment.apply(this, arguments);
      }

      return refundPayment;
    }()
  }, {
    key: "cancelPayment",
    value: function () {
      var _cancelPayment = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(_) {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt("return", {});

              case 1:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      function cancelPayment(_x11) {
        return _cancelPayment.apply(this, arguments);
      }

      return cancelPayment;
    }()
  }]);

  return ShopifyProviderService;
}(_medusaInterfaces.PaymentService);

_defineProperty(ShopifyProviderService, "identifier", "shopify");

var _default = ShopifyProviderService;
exports["default"] = _default;