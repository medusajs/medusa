"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _bodyParser = _interopRequireDefault(require("body-parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = function _default(container) {
  var app = (0, _express.Router)();
  app.post("/brightpearl/product", _bodyParser["default"].json(), /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
      var _req$body, id, lifecycle_event, eventBus, brightpearlService, bpProduct;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _req$body = req.body, id = _req$body.id, lifecycle_event = _req$body.lifecycle_event;

              if (!(lifecycle_event === "created")) {
                _context.next = 8;
                break;
              }

              eventBus = req.scope.resolve("eventBusService");
              brightpearlService = req.scope.resolve("brightpearlService");
              _context.next = 6;
              return brightpearlService.retrieveProduct(id);

            case 6:
              bpProduct = _context.sent;
              eventBus.emit("brightpearl-product.created", bpProduct);

            case 8:
              res.sendStatus(200);

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
  app.post("/brightpearl/goods-out", _bodyParser["default"].json(), /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
      var _req$body2, id, lifecycle_event, brightpearlService;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _req$body2 = req.body, id = _req$body2.id, lifecycle_event = _req$body2.lifecycle_event;
              brightpearlService = req.scope.resolve("brightpearlService");

              if (!(lifecycle_event === "created")) {
                _context2.next = 5;
                break;
              }

              _context2.next = 5;
              return brightpearlService.createFulfillmentFromGoodsOut(id);

            case 5:
              res.sendStatus(200);

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());
  app.post("/brightpearl/inventory-update", _bodyParser["default"].json(), /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
      var id, brightpearlService;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              id = req.body.id;
              brightpearlService = req.scope.resolve("brightpearlService");
              _context3.next = 4;
              return brightpearlService.updateInventory(id);

            case 4:
              res.sendStatus(200);

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }());
  return app;
};

exports["default"] = _default;