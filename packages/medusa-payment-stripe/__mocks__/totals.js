"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.TotalsServiceMock = void 0;
var TotalsServiceMock = {
  getTotal: jest.fn()
};
exports.TotalsServiceMock = TotalsServiceMock;
var mock = jest.fn().mockImplementation(function () {
  return TotalsServiceMock;
});
var _default = mock;
exports["default"] = _default;