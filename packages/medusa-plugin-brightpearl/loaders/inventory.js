"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var inventorySync = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(container) {
    var brightpearlService, eventBus, client, pattern;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            brightpearlService = container.resolve("brightpearlService");
            eventBus = container.resolve("eventBusService");
            console.log("hi inventory");
            _context.prev = 3;
            _context.next = 6;
            return brightpearlService.getClient();

          case 6:
            client = _context.sent;
            pattern = "43 4,10,14,20 * * *"; // nice for tests "*/10 * * * * *"

            eventBus.createCronJob("inventory-sync", {}, pattern, brightpearlService.syncInventory());
            _context.next = 16;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](3);

            if (!(_context.t0.name === "not_allowed")) {
              _context.next = 15;
              break;
            }

            return _context.abrupt("return");

          case 15:
            throw _context.t0;

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 11]]);
  }));

  return function inventorySync(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = inventorySync;
exports["default"] = _default;