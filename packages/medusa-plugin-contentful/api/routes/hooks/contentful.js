"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var contentfulService, contentfulType, entryId, updated;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            contentfulService = req.scope.resolve("contentfulService");
            contentfulType = req.body.sys.contentType.sys.id;
            entryId = req.body.sys.id;
            updated = {};
            _context.t0 = contentfulType;
            _context.next = _context.t0 === "product" ? 8 : _context.t0 === "productVariant" ? 12 : 16;
            break;

          case 8:
            _context.next = 10;
            return contentfulService.sendContentfulProductToAdmin(entryId);

          case 10:
            updated = _context.sent;
            return _context.abrupt("break", 17);

          case 12:
            _context.next = 14;
            return contentfulService.sendContentfulProductVariantToAdmin(entryId);

          case 14:
            updated = _context.sent;
            return _context.abrupt("break", 17);

          case 16:
            return _context.abrupt("break", 17);

          case 17:
            res.status(200).send(updated);
            _context.next = 23;
            break;

          case 20:
            _context.prev = 20;
            _context.t1 = _context["catch"](0);
            res.status(400).send("Webhook error: ".concat(_context.t1.message));

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 20]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;