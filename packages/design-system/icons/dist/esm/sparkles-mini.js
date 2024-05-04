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
const SparklesMini = React.forwardRef(
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
          d: "M8.542 12.603 8 14.5l-.542-1.897a3 3 0 0 0-2.06-2.06L3.5 10l1.897-.542a3 3 0 0 0 2.06-2.06L8 5.5l.542 1.897a3 3 0 0 0 2.06 2.06L12.5 10l-1.897.542a3 3 0 0 0-2.06 2.06h-.001Zm5.63-4.793L14 8.5l-.173-.69a2.25 2.25 0 0 0-1.636-1.637L11.5 6l.69-.173a2.25 2.25 0 0 0 1.637-1.637L14 3.5l.173.69a2.25 2.25 0 0 0 1.637 1.637L16.5 6l-.69.173a2.25 2.25 0 0 0-1.637 1.637Zm-.91 7.901L13 16.5l-.263-.789a1.5 1.5 0 0 0-.948-.948L11 14.5l.789-.263a1.5 1.5 0 0 0 .948-.948L13 12.5l.263.789a1.5 1.5 0 0 0 .948.948L15 14.5l-.789.263a1.5 1.5 0 0 0-.948.948Z"
        }
      )
    );
  }
);
SparklesMini.displayName = "SparklesMini";

export { SparklesMini as default };
//# sourceMappingURL=sparkles-mini.js.map
