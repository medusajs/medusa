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
const BellAlertSolid = React.forwardRef(
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
          d: "M4.875 2.917a.625.625 0 0 0-.93-.834 8.1 8.1 0 0 0-1.957 4.064.625.625 0 0 0 1.232.206 6.85 6.85 0 0 1 1.655-3.436Zm11.18-.834a.625.625 0 1 0-.93.834 6.85 6.85 0 0 1 1.655 3.436.625.625 0 0 0 1.233-.206 8.098 8.098 0 0 0-1.957-4.064Z"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: color,
          fillRule: "evenodd",
          d: "M10 1.875A5.625 5.625 0 0 0 4.375 7.5v.625a6.847 6.847 0 0 1-1.766 4.6.625.625 0 0 0 .248 1.005 20.46 20.46 0 0 0 4.026 1.036 3.125 3.125 0 1 0 6.234 0 20.488 20.488 0 0 0 4.025-1.037.625.625 0 0 0 .248-1.004 6.847 6.847 0 0 1-1.765-4.6V7.5A5.625 5.625 0 0 0 10 1.875ZM8.125 15c0-.028 0-.056.002-.083 1.246.112 2.5.112 3.746 0l.002.083a1.875 1.875 0 1 1-3.75 0Z",
          clipRule: "evenodd"
        }
      )
    );
  }
);
BellAlertSolid.displayName = "BellAlertSolid";

export { BellAlertSolid as default };
//# sourceMappingURL=bell-alert-solid.js.map
