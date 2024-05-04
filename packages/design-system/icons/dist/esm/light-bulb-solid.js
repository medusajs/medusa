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
const LightBulbSolid = React.forwardRef(
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
          d: "M10 1.812a6.004 6.004 0 0 0-3.01 11.2c.5.29.812.734.826 1.182a.546.546 0 0 0 .42.514 7.7 7.7 0 0 0 .782.142.392.392 0 0 0 .436-.396v-3.392a4.9 4.9 0 0 1-.682-.125.546.546 0 0 1 .272-1.057 3.828 3.828 0 0 0 1.912 0 .546.546 0 1 1 .272 1.056c-.224.058-.452.1-.682.126v3.391c0 .238.202.427.437.397.264-.034.525-.082.781-.142a.546.546 0 0 0 .42-.514c.015-.448.326-.891.825-1.181A6.004 6.004 0 0 0 10 1.813Z"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: color,
          fillRule: "evenodd",
          d: "M7.826 15.75a.546.546 0 0 1 .638-.435 8.239 8.239 0 0 0 3.072 0 .546.546 0 1 1 .203 1.072 9.33 9.33 0 0 1-3.478 0 .546.546 0 0 1-.435-.638Zm.54 1.778a.545.545 0 0 1 .6-.486 9.957 9.957 0 0 0 2.069 0 .545.545 0 1 1 .113 1.086c-.763.08-1.533.08-2.296 0a.544.544 0 0 1-.487-.6Z",
          clipRule: "evenodd"
        }
      )
    );
  }
);
LightBulbSolid.displayName = "LightBulbSolid";

export { LightBulbSolid as default };
//# sourceMappingURL=light-bulb-solid.js.map
