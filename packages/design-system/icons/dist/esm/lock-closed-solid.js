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
const LockClosedSolid = React.forwardRef(
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
          fill: color,
          d: "M13.611 10a.834.834 0 0 1-.833-.833V5.556A2.782 2.782 0 0 0 10 2.778a2.782 2.782 0 0 0-2.778 2.778v3.61a.834.834 0 0 1-1.666 0v-3.61A4.449 4.449 0 0 1 10 1.11a4.449 4.449 0 0 1 4.444 4.445v3.61c0 .46-.373.834-.833.834Z"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: color,
          d: "M14.167 8.333H5.833a3.058 3.058 0 0 0-3.055 3.056v4.444a3.058 3.058 0 0 0 3.055 3.056h8.334a3.058 3.058 0 0 0 3.055-3.056V11.39a3.058 3.058 0 0 0-3.055-3.056Zm-3.334 5.834a.834.834 0 0 1-1.666 0v-1.111a.834.834 0 0 1 1.666 0v1.11Z"
        }
      )
    );
  }
);
LockClosedSolid.displayName = "LockClosedSolid";

export { LockClosedSolid as default };
//# sourceMappingURL=lock-closed-solid.js.map
