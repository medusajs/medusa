"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _medusaCoreUtils = require("medusa-core-utils");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var schema, _schema$validate, value, error, sendgridService;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            schema = _medusaCoreUtils.Validator.object().keys({
              template_id: _medusaCoreUtils.Validator.string().required(),
              from: _medusaCoreUtils.Validator.string().required(),
              to: _medusaCoreUtils.Validator.string().required(),
              data: _medusaCoreUtils.Validator.object().optional()["default"]({})
            });
            _schema$validate = schema.validate(req.body), value = _schema$validate.value, error = _schema$validate.error;

            if (!error) {
              _context.next = 4;
              break;
            }

            throw new _medusaCoreUtils.MedusaError(_medusaCoreUtils.MedusaError.Types.INVALID_DATA, error.details);

          case 4:
            _context.prev = 4;
            sendgridService = req.scope.resolve("sendgridService");
            _context.next = 8;
            return sendgridService.sendEmail(value.template_id, value.from, value.to, value.data);

          case 8:
            res.sendStatus(200);
            _context.next = 14;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](4);
            throw _context.t0;

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 11]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;