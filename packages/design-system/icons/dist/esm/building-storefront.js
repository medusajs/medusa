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
const BuildingStorefront = React.forwardRef(
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
          d: "M11.25 17.5v-6.25a.625.625 0 0 1 .625-.625h2.5a.625.625 0 0 1 .625.625v6.25m-3.75 0H1.967m9.283 0H15m0 0h3.033m-1.158 0V7.79a2.499 2.499 0 0 0 .517-3.933l-.991-.99a1.25 1.25 0 0 0-.883-.367H4.482c-.332 0-.65.132-.884.367l-.99.99a2.503 2.503 0 0 0 .517 3.933m0 9.71V7.791a2.5 2.5 0 0 0 3.125-.513 2.494 2.494 0 0 0 1.875.846c.747 0 1.417-.327 1.875-.847a2.494 2.494 0 0 0 1.875.847c.747 0 1.417-.327 1.875-.847a2.5 2.5 0 0 0 3.125.512M5.625 15H8.75a.625.625 0 0 0 .625-.626V11.25a.625.625 0 0 0-.625-.625H5.625A.625.625 0 0 0 5 11.25v3.125c0 .346.28.624.625.624Z"
        }
      )
    );
  }
);
BuildingStorefront.displayName = "BuildingStorefront";

export { BuildingStorefront as default };
//# sourceMappingURL=building-storefront.js.map
