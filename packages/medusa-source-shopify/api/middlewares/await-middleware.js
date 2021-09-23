"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(fn) {
  return function () {
    return fn.apply(void 0, arguments)["catch"](arguments.length <= 2 ? undefined : arguments[2]);
  };
};

exports["default"] = _default;