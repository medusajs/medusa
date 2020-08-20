"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var mockAxios = jest.genMockFromModule("axios");
mockAxios.create = jest.fn(function () {
  return mockAxios;
});
var _default = mockAxios;
exports["default"] = _default;