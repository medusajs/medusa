"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _medusaCoreUtils = require("medusa-core-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = function _default() {
  var app = (0, _express.Router)();
  app["delete"]("/:id/wishlist", _bodyParser["default"].json(), /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
      var schema, _schema$validate, value, error, customerService, customer, wishlist, newWishlist, data;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              schema = _medusaCoreUtils.Validator.object().keys({
                index: _medusaCoreUtils.Validator.number().required()
              });
              _schema$validate = schema.validate(req.body), value = _schema$validate.value, error = _schema$validate.error;

              if (!error) {
                _context.next = 4;
                break;
              }

              throw new _medusaCoreUtils.MedusaError(_medusaCoreUtils.MedusaError.Types.INVALID_DATA, error.details);

            case 4:
              _context.prev = 4;
              customerService = req.scope.resolve("customerService");
              _context.next = 8;
              return customerService.retrieve(req.params.id);

            case 8:
              customer = _context.sent;
              wishlist = customer.metadata && customer.metadata.wishlist || [];
              newWishlist = _toConsumableArray(wishlist);
              newWishlist.splice(value.index, 1);
              _context.next = 14;
              return customerService.setMetadata(customer._id, "wishlist", newWishlist);

            case 14:
              customer = _context.sent;
              _context.next = 17;
              return customerService.decorate(customer, ["email", "first_name", "last_name", "shipping_addresses"], ["orders"]);

            case 17:
              data = _context.sent;
              res.json({
                customer: data
              });
              _context.next = 24;
              break;

            case 21:
              _context.prev = 21;
              _context.t0 = _context["catch"](4);
              throw _context.t0;

            case 24:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[4, 21]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
  app.post("/:id/wishlist", _bodyParser["default"].json(), /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
      var schema, _schema$validate2, value, error, lineItemService, customerService, regionService, customer, regions, lineItem, wishlist, data;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              schema = _medusaCoreUtils.Validator.object().keys({
                variant_id: _medusaCoreUtils.Validator.string().required(),
                quantity: _medusaCoreUtils.Validator.number().required()
              });
              _schema$validate2 = schema.validate(req.body), value = _schema$validate2.value, error = _schema$validate2.error;

              if (!error) {
                _context2.next = 4;
                break;
              }

              throw new _medusaCoreUtils.MedusaError(_medusaCoreUtils.MedusaError.Types.INVALID_DATA, error.details);

            case 4:
              _context2.prev = 4;
              lineItemService = req.scope.resolve("lineItemService");
              customerService = req.scope.resolve("customerService");
              regionService = req.scope.resolve("regionService");
              _context2.next = 10;
              return customerService.retrieve(req.params.id);

            case 10:
              customer = _context2.sent;
              _context2.next = 13;
              return regionService.list();

            case 13:
              regions = _context2.sent;

              if (!regions.length) {
                _context2.next = 22;
                break;
              }

              _context2.next = 17;
              return lineItemService.generate(value.variant_id, regions[0]._id, value.quantity);

            case 17:
              lineItem = _context2.sent;
              wishlist = customer.metadata && customer.metadata.wishlist || [];
              _context2.next = 21;
              return customerService.setMetadata(customer._id, "wishlist", [].concat(_toConsumableArray(wishlist), [lineItem]));

            case 21:
              customer = _context2.sent;

            case 22:
              _context2.next = 24;
              return customerService.decorate(customer, ["email", "first_name", "last_name", "shipping_addresses"], ["orders"]);

            case 24:
              data = _context2.sent;
              res.json({
                customer: data
              });
              _context2.next = 31;
              break;

            case 28:
              _context2.prev = 28;
              _context2.t0 = _context2["catch"](4);
              throw _context2.t0;

            case 31:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[4, 28]]);
    }));

    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());
  return app;
};

exports["default"] = _default;