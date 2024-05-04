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
const Swatch = React.forwardRef(
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
          d: "M3.415 16.585a3.124 3.124 0 0 0 2.21.916m-2.21-.916a3.126 3.126 0 0 0 2.21.916m-2.21-.916a3.125 3.125 0 0 1-.915-2.21V3.437c0-.517.42-.937.938-.937h4.374c.518 0 .938.42.938.938V6.83M5.625 17.5a3.125 3.125 0 0 0 2.21-.916m-2.21.916c.829 0 1.624-.33 2.21-.916m-2.21.916 10.938-.001c.517 0 .937-.42.937-.938v-4.375a.938.938 0 0 0-.938-.937H13.17m-5.334 5.335 5.334-5.335m-5.334 5.335a3.125 3.125 0 0 0 .915-2.21V6.831m4.42 4.419 2.398-2.4a.935.935 0 0 0 0-1.325l-3.093-3.094a.937.937 0 0 0-1.325 0l-2.4 2.4m-3.125 7.544h.007v.007h-.007v-.007Z"
        }
      )
    );
  }
);
Swatch.displayName = "Swatch";

export { Swatch as default };
//# sourceMappingURL=swatch.js.map
