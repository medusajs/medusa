"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _medusaCoreUtils = require("medusa-core-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = function _default(container) {
  var route = (0, _express.Router)();
  route.post("/discount-code", _bodyParser["default"].json(), /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
      var schema, _schema$validate, value, error, discountGenerator, code;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              schema = _medusaCoreUtils.Validator.object().keys({
                discount_code: _medusaCoreUtils.Validator.string().required()
              });
              _schema$validate = schema.validate(req.body), value = _schema$validate.value, error = _schema$validate.error;

              if (!error) {
                _context.next = 4;
                break;
              }

              throw new _medusaCoreUtils.MedusaError(_medusaCoreUtils.MedusaError.Types.INVALID_DATA, error.details);

            case 4:
              discountGenerator = req.scope.resolve("discountGeneratorService");
              _context.next = 7;
              return discountGenerator.generateDiscount(value.discount_code);

            case 7:
              code = _context.sent;
              res.json({
                code: code
              });

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
  return route;
};

exports["default"] = _default;