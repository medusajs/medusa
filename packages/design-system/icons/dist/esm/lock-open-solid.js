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
const LockOpenSolid = React.forwardRef(
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
      /* @__PURE__ */ React.createElement("g", { fill: color, clipPath: "url(#a)" }, /* @__PURE__ */ React.createElement("path", { d: "M8.056 10a.834.834 0 0 1-.834-.833V5.556a2.782 2.782 0 0 0-2.778-2.778 2.782 2.782 0 0 0-2.777 2.778v1.388a.834.834 0 0 1-1.667 0V5.556A4.449 4.449 0 0 1 4.444 1.11 4.449 4.449 0 0 1 8.89 5.556v3.61c0 .46-.373.834-.833.834Z" }), /* @__PURE__ */ React.createElement("path", { d: "M14.722 8.333H6.39a3.058 3.058 0 0 0-3.056 3.056v4.444A3.058 3.058 0 0 0 6.39 18.89h8.333a3.058 3.058 0 0 0 3.056-3.056V11.39a3.058 3.058 0 0 0-3.056-3.056Zm-3.333 5.834a.834.834 0 0 1-1.667 0v-1.111a.834.834 0 0 1 1.667 0v1.11Z" })),
      /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("clipPath", { id: "a" }, /* @__PURE__ */ React.createElement("path", { fill: "#fff", d: "M0 0h20v20H0z" })))
    );
  }
);
LockOpenSolid.displayName = "LockOpenSolid";

export { LockOpenSolid as default };
//# sourceMappingURL=lock-open-solid.js.map
