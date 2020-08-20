"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OrderSubscriber = function OrderSubscriber(_ref) {
  var _this = this;

  var sendgridService = _ref.sendgridService,
      eventBusService = _ref.eventBusService;

  _classCallCheck(this, OrderSubscriber);

  this.sendgridService_ = sendgridService;
  this.eventBus_ = eventBusService;
  this.eventBus_.subscribe("order.gift_card_created", /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(order) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _this.sendgridService_.transactionalEmail("order.gift_card_created", order);

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }());
  this.eventBus_.subscribe("order.placed", /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(order) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _this.sendgridService_.transactionalEmail("order.placed", order);

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x2) {
      return _ref3.apply(this, arguments);
    };
  }());
  this.eventBus_.subscribe("order.cancelled", /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(order) {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _this.sendgridService_.transactionalEmail("order.cancelled", order);

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x3) {
      return _ref4.apply(this, arguments);
    };
  }());
  this.eventBus_.subscribe("order.completed", /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(order) {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return _this.sendgridService_.transactionalEmail("order.completed", order);

            case 2:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x4) {
      return _ref5.apply(this, arguments);
    };
  }());
  this.eventBus_.subscribe("order.updated", /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(order) {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return _this.sendgridService_.transactionalEmail("order.updated", order);

            case 2:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x5) {
      return _ref6.apply(this, arguments);
    };
  }());
};

var _default = OrderSubscriber;
exports["default"] = _default;