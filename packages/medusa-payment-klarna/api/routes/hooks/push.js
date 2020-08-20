"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _medusaCoreUtils = require("medusa-core-utils");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var klarna_order_id, cartService, orderService, klarnaProviderService, klarnaOrder, cartId, order, cart, _order;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            klarna_order_id = req.query.klarna_order_id;
            _context.prev = 1;
            cartService = req.scope.resolve("cartService");
            orderService = req.scope.resolve("orderService");
            klarnaProviderService = req.scope.resolve("pp_klarna");
            _context.next = 7;
            return klarnaProviderService.retrieveCompletedOrder(klarna_order_id).then(function (_ref2) {
              var data = _ref2.data;
              return data;
            });

          case 7:
            klarnaOrder = _context.sent;
            cartId = klarnaOrder.merchant_data;
            _context.prev = 9;
            _context.next = 12;
            return orderService.retrieveByCartId(cartId);

          case 12:
            order = _context.sent;
            _context.next = 15;
            return klarnaProviderService.acknowledgeOrder(klarnaOrder.order_id, order._id);

          case 15:
            _context.next = 28;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](9);

            if (!(_context.t0.type === _medusaCoreUtils.MedusaError.Types.NOT_FOUND)) {
              _context.next = 28;
              break;
            }

            _context.next = 22;
            return cartService.retrieve(cartId);

          case 22:
            cart = _context.sent;
            _context.next = 25;
            return orderService.createFromCart(cart);

          case 25:
            _order = _context.sent;
            _context.next = 28;
            return klarnaProviderService.acknowledgeOrder(klarnaOrder.order_id, _order._id);

          case 28:
            res.sendStatus(200);
            _context.next = 35;
            break;

          case 31:
            _context.prev = 31;
            _context.t1 = _context["catch"](1);
            console.log(_context.t1);
            throw _context.t1;

          case 35:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 31], [9, 17]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;