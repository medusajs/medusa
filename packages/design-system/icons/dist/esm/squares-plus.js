/**
 * @medusajs/icons v1.2.1 - MIT
 */

import * as React from 'react';

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const SquaresPlus = React.forwardRef(
  (_a, ref) => {
    var _b = _a, { color = "currentColor" } = _b, props = __objRest(_b, ["color"]);
    return /* @__PURE__ */ React.createElement(
      "svg",
      __spreadValues({
        xmlns: "http://www.w3.org/2000/svg",
        width: 20,
        height: 20,
        fill: "none",
        ref
      }, props),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          stroke: color,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 1.5,
          d: "M11.25 14.063h2.813m0 0h2.812m-2.813 0V11.25m0 2.813v2.812M5 8.75h1.875A1.875 1.875 0 0 0 8.75 6.875V5a1.875 1.875 0 0 0-1.875-1.875H5A1.875 1.875 0 0 0 3.125 5v1.875A1.875 1.875 0 0 0 5 8.75v0Zm0 8.125h1.875A1.875 1.875 0 0 0 8.75 15v-1.875a1.875 1.875 0 0 0-1.875-1.875H5a1.875 1.875 0 0 0-1.875 1.875V15A1.875 1.875 0 0 0 5 16.875Zm8.125-8.125H15a1.875 1.875 0 0 0 1.875-1.875V5A1.875 1.875 0 0 0 15 3.125h-1.875A1.875 1.875 0 0 0 11.25 5v1.875a1.875 1.875 0 0 0 1.875 1.875v0Z"
        }
      )
    );
  }
);
SquaresPlus.displayName = "SquaresPlus";

export { SquaresPlus as default };
//# sourceMappingURL=squares-plus.js.map
