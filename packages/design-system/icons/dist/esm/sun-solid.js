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
const SunSolid = React.forwardRef(
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
          d: "M10 1.875a.625.625 0 0 1 .625.625v1.875a.625.625 0 1 1-1.25 0V2.5A.625.625 0 0 1 10 1.875ZM6.25 10a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0Zm9.495-4.862a.625.625 0 0 0-.883-.883L13.536 5.58a.625.625 0 1 0 .883.884l1.326-1.326ZM18.125 10a.624.624 0 0 1-.625.625h-1.875a.624.624 0 1 1 0-1.25H17.5a.625.625 0 0 1 .625.625Zm-3.263 5.745a.625.625 0 0 0 .883-.883l-1.325-1.326a.625.625 0 1 0-.884.883l1.326 1.326ZM10 15a.624.624 0 0 1 .625.625V17.5a.624.624 0 1 1-1.25 0v-1.875A.625.625 0 0 1 10 15Zm-3.535-.58a.625.625 0 0 0-.884-.884L4.255 14.86a.625.625 0 0 0 .883.884l1.326-1.325h.001ZM5 10a.625.625 0 0 1-.625.625H2.5a.625.625 0 1 1 0-1.25h1.875A.625.625 0 0 1 5 10Zm.58-3.536a.625.625 0 0 0 .884-.883L5.14 4.255a.625.625 0 0 0-.884.883l1.326 1.326Z"
        }
      )
    );
  }
);
SunSolid.displayName = "SunSolid";

export { SunSolid as default };
//# sourceMappingURL=sun-solid.js.map
