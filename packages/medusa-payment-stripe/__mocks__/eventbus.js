"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.EventBusServiceMock = void 0;
var EventBusServiceMock = {
  emit: jest.fn(),
  subscribe: jest.fn()
};
exports.EventBusServiceMock = EventBusServiceMock;
var mock = jest.fn().mockImplementation(function () {
  return EventBusServiceMock;
});
var _default = mock;
exports["default"] = _default;