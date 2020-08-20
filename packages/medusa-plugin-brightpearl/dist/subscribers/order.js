"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var OrderSubscriber = function OrderSubscriber(_ref) {
  var _this = this;

  var eventBusService = _ref.eventBusService,
      orderService = _ref.orderService,
      brightpearlService = _ref.brightpearlService;

  _classCallCheck(this, OrderSubscriber);

  _defineProperty(this, "sendToBrightpearl", function (order) {
    return _this.brightpearlService_.createSalesOrder(order);
  });

  _defineProperty(this, "registerCapturedPayment", function (order) {
    return _this.brightpearlService_.createCapturedPayment(order);
  });

  _defineProperty(this, "registerShipment", /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
      var order_id, shipment, order, notes, noteId;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              order_id = data.order_id, shipment = data.shipment;
              _context.next = 3;
              return _this.orderService_.retrieve(order_id);

            case 3:
              order = _context.sent;
              _context.next = 6;
              return _this.brightpearlService_.createGoodsOutNote(order, shipment);

            case 6:
              notes = _context.sent;

              if (!notes.length) {
                _context.next = 13;
                break;
              }

              noteId = notes[0];
              _context.next = 11;
              return _this.brightpearlService_.registerGoodsOutTrackingNumber(noteId, shipment);

            case 11:
              _context.next = 13;
              return _this.brightpearlService_.registerGoodsOutShipped(noteId, shipment);

            case 13:
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

  this.orderService_ = orderService;
  this.brightpearlService_ = brightpearlService;
  eventBusService.subscribe("order.placed", this.sendToBrightpearl);
  eventBusService.subscribe("order.payment_captured", this.registerCapturedPayment);
  eventBusService.subscribe("order.shipment_created", this.registerShipment);
};

var _default = OrderSubscriber;
exports["default"] = _default;