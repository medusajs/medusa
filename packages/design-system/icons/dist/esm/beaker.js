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
const Beaker = React.forwardRef(
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
          strokeWidth: 1.25,
          d: "M8.125 2.587v4.761a1.875 1.875 0 0 1-.55 1.326l-3.408 3.41m3.958-9.498c-.21.02-.418.042-.625.069m.625-.068a20.252 20.252 0 0 1 3.75 0m-7.708 9.496.641-.16A7.554 7.554 0 0 1 10 12.5a7.554 7.554 0 0 0 5.192.577l1.308-.327m-12.333-.667L2.332 13.92c-1.028 1.026-.543 2.764.889 3.008 2.203.377 4.468.573 6.779.573 2.272 0 4.54-.19 6.78-.573 1.43-.244 1.915-1.982.888-3.009L16.5 12.75M11.875 2.587v4.761c0 .498.197.975.55 1.326L16.5 12.75M11.875 2.587c.21.019.418.041.625.068"
        }
      )
    );
  }
);
Beaker.displayName = "Beaker";

export { Beaker as default };
//# sourceMappingURL=beaker.js.map
