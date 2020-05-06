"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CartSubscriber =
/*#__PURE__*/
function () {
  function CartSubscriber(_ref) {
    var cartService = _ref.cartService,
        eventBusService = _ref.eventBusService;

    _classCallCheck(this, CartSubscriber);

    this.eventBus_ = eventBusService;
    this.eventBus_.subscribe("cart.created", this.log);
    this.eventBus_.subscribe("cart.updated", this.log);
  }

  _createClass(CartSubscriber, [{
    key: "log",
    value: function () {
      var _log = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(c) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.log(c);

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function log(_x) {
        return _log.apply(this, arguments);
      }

      return log;
    }()
  }]);

  return CartSubscriber;
}();

var _default = CartSubscriber;
exports["default"] = _default;