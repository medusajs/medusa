"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var poll = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref) {
    var fn, interval, maxAttempts, attempts, executePoll;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            fn = _ref.fn, interval = _ref.interval, maxAttempts = _ref.maxAttempts;
            attempts = 0;

            executePoll = /*#__PURE__*/function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {
                var result;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return fn();

                      case 2:
                        result = _context.sent;
                        attempts++;

                        if (!(maxAttempts && attempts === maxAttempts)) {
                          _context.next = 8;
                          break;
                        }

                        return _context.abrupt("return", reject(new Error("Exceeded max attempts")));

                      case 8:
                        setTimeout(executePoll, interval, resolve, reject);

                      case 9:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function executePoll(_x2, _x3) {
                return _ref3.apply(this, arguments);
              };
            }();

            return _context2.abrupt("return", new Promise(executePoll));

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function poll(_x) {
    return _ref2.apply(this, arguments);
  };
}();