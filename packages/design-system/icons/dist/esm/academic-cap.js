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
const AcademicCap = React.forwardRef(
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
          d: "M3.55 8.456a50.366 50.366 0 0 0-.41 5.289A40.52 40.52 0 0 1 10 17.42a40.528 40.528 0 0 1 6.86-3.675 50.374 50.374 0 0 0-.41-5.29m0 0c.73-.244 1.47-.471 2.216-.678A49.919 49.919 0 0 0 10 2.911a49.922 49.922 0 0 0-8.666 4.867A42.152 42.152 0 0 1 10 11.241a42.27 42.27 0 0 1 6.45-2.785ZM5.626 12.5a.625.625 0 1 0 0-1.25.625.625 0 0 0 0 1.25Zm0 0V9.437A46.151 46.151 0 0 1 10 7.036M4.16 16.66a4.983 4.983 0 0 0 1.465-3.536v-1.25"
        }
      )
    );
  }
);
AcademicCap.displayName = "AcademicCap";

export { AcademicCap as default };
//# sourceMappingURL=academic-cap.js.map
