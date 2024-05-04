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
const RocketLaunch = React.forwardRef(
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
          d: "M12.784 11.838a4.653 4.653 0 0 1-4.53 5.725v-3.724m4.53-2a11.62 11.62 0 0 0 4.778-9.402 11.62 11.62 0 0 0-9.4 4.778m4.623 4.623a11.577 11.577 0 0 1-4.53 2.001m-.093-6.624a4.654 4.654 0 0 0-5.725 4.53h3.724m2.002-4.53a11.578 11.578 0 0 0-2.002 4.53m2.094 2.094c-.08.017-.16.032-.241.047a11.704 11.704 0 0 1-1.9-1.899l.047-.242M4.424 13.6a3.485 3.485 0 0 0-1.363 3.34 3.486 3.486 0 0 0 3.34-1.364m7.09-7.902a1.163 1.163 0 1 1-2.327 0 1.163 1.163 0 0 1 2.326 0Z"
        }
      )
    );
  }
);
RocketLaunch.displayName = "RocketLaunch";

export { RocketLaunch as default };
//# sourceMappingURL=rocket-launch.js.map
