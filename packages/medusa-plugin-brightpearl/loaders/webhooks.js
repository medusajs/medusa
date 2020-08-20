"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var webhookLoader = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(container) {
    var brightpearlService, client;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            brightpearlService = container.resolve("brightpearlService");
            _context.prev = 1;
            _context.next = 4;
            return brightpearlService.getClient();

          case 4:
            client = _context.sent;
            _context.next = 7;
            return brightpearlService.verifyWebhooks();

          case 7:
            _context.next = 14;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](1);

            if (!(_context.t0.name === "not_allowed")) {
              _context.next = 13;
              break;
            }

            return _context.abrupt("return");

          case 13:
            throw _context.t0;

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 9]]);
  }));

  return function webhookLoader(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = webhookLoader;
exports["default"] = _default;