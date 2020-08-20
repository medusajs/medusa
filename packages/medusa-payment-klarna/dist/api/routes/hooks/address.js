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
  regeneratorRuntime.mark(function _callee(req, res) {
    var _req$body, shipping_address, merchant_data, cartService, klarnaProviderService, shippingProfileService, cart, updatedAddress, shippingOptions, option, updatedCart, order;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // In Medusa, we store the cart id in merchant_data
            _req$body = req.body, shipping_address = _req$body.shipping_address, merchant_data = _req$body.merchant_data;
            _context.prev = 1;
            cartService = req.scope.resolve("cartService");
            klarnaProviderService = req.scope.resolve("pp_klarna");
            shippingProfileService = req.scope.resolve("shippingProfileService");
            _context.next = 7;
            return cartService.retrieve(merchant_data);

          case 7:
            cart = _context.sent;

            if (!shipping_address) {
              _context.next = 33;
              break;
            }

            updatedAddress = {
              first_name: shipping_address.given_name,
              last_name: shipping_address.family_name,
              address_1: shipping_address.street_address,
              address_2: shipping_address.street_address2,
              city: shipping_address.city,
              country_code: shipping_address.country.toUpperCase(),
              postal_code: shipping_address.postal_code,
              phone: shipping_address.phone
            };
            _context.next = 12;
            return cartService.updateShippingAddress(cart._id, updatedAddress);

          case 12:
            _context.next = 14;
            return cartService.updateBillingAddress(cart._id, updatedAddress);

          case 14:
            _context.next = 16;
            return cartService.updateEmail(cart._id, shipping_address.email);

          case 16:
            _context.next = 18;
            return shippingProfileService.fetchCartOptions(cart);

          case 18:
            shippingOptions = _context.sent;

            if (!(shippingOptions.length === 1)) {
              _context.next = 23;
              break;
            }

            option = shippingOptions[0];
            _context.next = 23;
            return cartService.addShippingMethod(cart._id, option._id, option.data);

          case 23:
            _context.next = 25;
            return cartService.retrieve(cart._id);

          case 25:
            updatedCart = _context.sent;
            _context.next = 28;
            return klarnaProviderService.cartToKlarnaOrder(updatedCart);

          case 28:
            order = _context.sent;
            res.json(order);
            return _context.abrupt("return");

          case 33:
            res.sendStatus(400);
            return _context.abrupt("return");

          case 35:
            _context.next = 40;
            break;

          case 37:
            _context.prev = 37;
            _context.t0 = _context["catch"](1);
            throw _context.t0;

          case 40:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 37]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;