"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var _req$body, merchant_data, selected_shipping_option, cartService, klarnaProviderService, shippingProfileService, cart, shippingOptions, ids, newCart, order;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // In Medusa, we store the cart id in merchant_data
            _req$body = req.body, merchant_data = _req$body.merchant_data, selected_shipping_option = _req$body.selected_shipping_option;
            _context2.prev = 1;
            cartService = req.scope.resolve("cartService");
            klarnaProviderService = req.scope.resolve("pp_klarna");
            shippingProfileService = req.scope.resolve("shippingProfileService");
            _context2.next = 7;
            return cartService.retrieve(merchant_data);

          case 7:
            cart = _context2.sent;
            _context2.next = 10;
            return shippingProfileService.fetchCartOptions(cart);

          case 10:
            shippingOptions = _context2.sent;
            ids = selected_shipping_option.id.split(".");
            _context2.next = 14;
            return Promise.all(ids.map(
            /*#__PURE__*/
            function () {
              var _ref2 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee(id) {
                var option;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        option = shippingOptions.find(function (_ref3) {
                          var _id = _ref3._id;
                          return _id.equals(id);
                        });

                        if (!option) {
                          _context.next = 4;
                          break;
                        }

                        _context.next = 4;
                        return cartService.addShippingMethod(cart._id, option._id, option.data);

                      case 4:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 14:
            _context2.next = 16;
            return cartService.retrieve(cart._id);

          case 16:
            newCart = _context2.sent;
            _context2.next = 19;
            return klarnaProviderService.cartToKlarnaOrder(newCart);

          case 19:
            order = _context2.sent;
            res.json(order);
            _context2.next = 26;
            break;

          case 23:
            _context2.prev = 23;
            _context2.t0 = _context2["catch"](1);
            throw _context2.t0;

          case 26:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 23]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;