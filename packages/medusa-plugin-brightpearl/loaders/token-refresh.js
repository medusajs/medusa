"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var REFRESH_CRON = process.env.BP_REFRESH_CRON || "5 4 * * */6";

var refreshToken = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(container) {
    var oauthService, eventBus, pattern;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            oauthService = container.resolve("oauthService");
            eventBus = container.resolve("eventBusService");
            _context2.prev = 2;
            pattern = REFRESH_CRON;
            eventBus.createCronJob("refresh-token-bp", {}, pattern, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
              var data;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return oauthService.retrieveByName("brightpearl");

                    case 2:
                      data = _context.sent;

                      if (!(!data || !data.access_token)) {
                        _context.next = 6;
                        break;
                      }

                      _context.next = 6;
                      return oauthService.refreshToken("brightpearl", data.refresh_token);

                    case 6:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            })));
            _context2.next = 12;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](2);

            if (!(_context2.t0.name === "not_allowed")) {
              _context2.next = 11;
              break;
            }

            return _context2.abrupt("return");

          case 11:
            throw _context2.t0;

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 7]]);
  }));

  return function refreshToken(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = inventorySync;
exports["default"] = _default;