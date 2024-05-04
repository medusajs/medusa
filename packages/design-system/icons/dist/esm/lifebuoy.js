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
const Lifebuoy = React.forwardRef(
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
          d: "M13.927 3.608a7.52 7.52 0 0 1 2.465 2.465m-2.465-2.465-2.874 3.449m2.874-3.449a7.512 7.512 0 0 0-7.854 0m10.319 2.465-3.449 2.874m3.449-2.874a7.512 7.512 0 0 1 0 7.854m-5.339-6.87c.435.155.83.406 1.157.733.327.326.578.721.733 1.157m-1.89-1.89a3.137 3.137 0 0 0-2.106 0M6.073 3.608l2.874 3.449M6.073 3.608a7.52 7.52 0 0 0-2.465 2.465m9.335 2.874a3.138 3.138 0 0 1 0 2.106m3.449 2.874-3.449-2.874m3.449 2.874a7.52 7.52 0 0 1-2.465 2.465m-.984-5.339a3.128 3.128 0 0 1-1.89 1.89M8.947 7.057a3.128 3.128 0 0 0-1.89 1.89m3.996 3.996 2.874 3.449m-2.874-3.449a3.137 3.137 0 0 1-2.106 0m4.98 3.449a7.511 7.511 0 0 1-7.854 0m0 0 2.874-3.449m-2.874 3.449a7.522 7.522 0 0 1-2.465-2.465m5.339-.984a3.115 3.115 0 0 1-1.157-.733 3.115 3.115 0 0 1-.733-1.157m0 0-3.449 2.874m3.449-2.874a3.138 3.138 0 0 1 0-2.106m-3.449 4.98a7.512 7.512 0 0 1 0-7.854m0 0 3.449 2.874"
        }
      )
    );
  }
);
Lifebuoy.displayName = "Lifebuoy";

export { Lifebuoy as default };
//# sourceMappingURL=lifebuoy.js.map
