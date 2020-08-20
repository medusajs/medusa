"use strict";

var _klarnaProvider = _interopRequireDefault(require("../klarna-provider"));

var _axios = _interopRequireDefault(require("../../__mocks__/axios"));

var _cart = require("../../__mocks__/cart");

var _totals = require("../../__mocks__/totals");

var _region = require("../../__mocks__/region");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

describe("KlarnaProviderService", function () {
  beforeEach(function () {
    _axios["default"].mockClear();
  });
  describe("createPayment", function () {
    var result;
    var klarnaProviderService = new _klarnaProvider["default"]({
      totalsService: _totals.TotalsServiceMock,
      regionService: _region.RegionServiceMock
    }, {
      url: "medusajs/tests",
      user: "lebronjames",
      password: "123456789",
      merchant_urls: {
        terms: "terms",
        checkout: "checkout",
        confirmation: "confirmation"
      }
    });
    beforeEach(
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              jest.clearAllMocks();

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    it("creates Klarna order",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _axios["default"].post.mockImplementation(function () {
                return Promise.resolve({
                  order_id: "123456789",
                  order_amount: 100
                });
              });

              _context2.next = 3;
              return klarnaProviderService.createPayment(_cart.carts.frCart);

            case 3:
              result = _context2.sent;
              expect(result).toEqual({
                order_id: "123456789",
                order_amount: 100
              });

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
  });
  describe("retrievePayment", function () {
    var result;
    beforeEach(
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              jest.clearAllMocks();

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
    var klarnaProviderService = new _klarnaProvider["default"]({
      totalsService: _totals.TotalsServiceMock
    }, {
      url: "medusajs/tests",
      user: "lebronjames",
      password: "123456789"
    });
    it("returns Klarna order",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _axios["default"].get.mockImplementation(function (data) {
                return Promise.resolve({
                  order_id: "123456789"
                });
              });

              _context4.next = 3;
              return klarnaProviderService.retrievePayment({
                payment_method: {
                  data: {
                    id: "123456789"
                  }
                }
              });

            case 3:
              result = _context4.sent;
              expect(result).toEqual({
                order_id: "123456789"
              });

            case 5:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
  });
  describe("retrieveCompletedOrder", function () {
    var result;
    beforeEach(
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5() {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              jest.clearAllMocks();

            case 1:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    })));
    var klarnaProviderService = new _klarnaProvider["default"]({
      totalsService: _totals.TotalsServiceMock
    }, {
      url: "medusajs/tests",
      user: "lebronjames",
      password: "123456789"
    });
    it("returns completed Klarna order",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6() {
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _axios["default"].get.mockImplementation(function (data) {
                return Promise.resolve({
                  order_id: "123456789"
                });
              });

              _context6.next = 3;
              return klarnaProviderService.retrieveCompletedOrder({
                payment_method: {
                  data: {
                    id: "123456789"
                  }
                }
              });

            case 3:
              result = _context6.sent;
              expect(result).toEqual({
                order_id: "123456789"
              });

            case 5:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    })));
  });
  describe("updatePayment", function () {
    var result;
    beforeEach(
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7() {
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              jest.clearAllMocks();

            case 1:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    })));
    var klarnaProviderService = new _klarnaProvider["default"]({
      totalsService: _totals.TotalsServiceMock
    }, {
      url: "medusajs/tests",
      user: "lebronjames",
      password: "123456789"
    });
    it("returns updated Klarna order",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee8() {
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _axios["default"].post.mockImplementation(function (data) {
                return Promise.resolve({
                  order_id: "123456789",
                  order_amount: 1000
                });
              });

              _context8.next = 3;
              return klarnaProviderService.updatePayment({
                payment_method: {
                  data: {
                    id: "123456789"
                  }
                }
              }, {
                order_amount: 1000
              });

            case 3:
              result = _context8.sent;
              expect(result).toEqual({
                order_id: "123456789",
                order_amount: 1000
              });

            case 5:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    })));
  });
  describe("cancelPayment", function () {
    var result;
    beforeEach(
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee9() {
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              jest.clearAllMocks();

            case 1:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    })));
    var klarnaProviderService = new _klarnaProvider["default"]({
      totalsService: _totals.TotalsServiceMock
    }, {
      url: "medusajs/tests",
      user: "lebronjames",
      password: "123456789"
    });
    it("returns order id",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee10() {
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _axios["default"].post.mockImplementation(function (data) {
                return Promise.resolve();
              });

              _context10.next = 3;
              return klarnaProviderService.cancelPayment({
                id: "123456789"
              });

            case 3:
              result = _context10.sent;
              expect(result).toEqual("123456789");

            case 5:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    })));
  });
  describe("acknowledgeOrder", function () {
    var result;
    beforeEach(
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee11() {
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              jest.clearAllMocks();

            case 1:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    })));
    var klarnaProviderService = new _klarnaProvider["default"]({
      totalsService: _totals.TotalsServiceMock
    }, {
      url: "medusajs/tests",
      user: "lebronjames",
      password: "123456789"
    });
    it("returns order id",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee12() {
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _axios["default"].post.mockImplementation(function (data) {
                return Promise.resolve({});
              });

              _context12.next = 3;
              return klarnaProviderService.acknowledgeOrder("123456789");

            case 3:
              result = _context12.sent;
              expect(result).toEqual("123456789");

            case 5:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    })));
  });
  describe("addOrderToKlarnaOrder", function () {
    var result;
    beforeEach(
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee13() {
      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              jest.clearAllMocks();

            case 1:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    })));
    var klarnaProviderService = new _klarnaProvider["default"]({
      totalsService: _totals.TotalsServiceMock
    }, {
      url: "medusajs/tests",
      user: "lebronjames",
      password: "123456789"
    });
    it("returns order id",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee14() {
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _axios["default"].post.mockImplementation(function (data) {
                return Promise.resolve();
              });

              _context14.next = 3;
              return klarnaProviderService.addOrderToKlarnaOrder("123456789", "order123456789");

            case 3:
              result = _context14.sent;
              expect(result).toEqual("123456789");

            case 5:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    })));
  });
  describe("capturePayment", function () {
    var result;
    beforeEach(
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee15() {
      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              jest.clearAllMocks();

            case 1:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15);
    })));
    var klarnaProviderService = new _klarnaProvider["default"]({
      totalsService: _totals.TotalsServiceMock
    }, {
      url: "medusajs/tests",
      user: "lebronjames",
      password: "123456789"
    });
    it("returns order id",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee16() {
      return regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _axios["default"].get.mockImplementation(function (data) {
                return Promise.resolve({
                  order: {
                    order_amount: 1000
                  }
                });
              });

              _axios["default"].post.mockImplementation(function (data) {
                return Promise.resolve();
              });

              _context16.next = 4;
              return klarnaProviderService.capturePayment({
                id: "123456789"
              });

            case 4:
              result = _context16.sent;
              expect(result).toEqual("123456789");

            case 6:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16);
    })));
  });
  describe("refundPayment", function () {
    var result;
    beforeEach(
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee17() {
      return regeneratorRuntime.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              jest.clearAllMocks();

            case 1:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17);
    })));
    var klarnaProviderService = new _klarnaProvider["default"]({
      totalsService: _totals.TotalsServiceMock
    }, {
      url: "medusajs/tests",
      user: "lebronjames",
      password: "123456789"
    });
    it("returns order id",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee18() {
      return regeneratorRuntime.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _axios["default"].post.mockImplementation(function (data) {
                return Promise.resolve();
              });

              _context18.next = 3;
              return klarnaProviderService.capturePayment({
                id: "123456789"
              }, 1000);

            case 3:
              result = _context18.sent;
              expect(result).toEqual("123456789");

            case 5:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18);
    })));
  });
});