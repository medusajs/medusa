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
const EnvelopeSolid = React.forwardRef(
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
          d: "M1.625 7.344v6.844a2.393 2.393 0 0 0 2.393 2.392h11.964a2.393 2.393 0 0 0 2.393-2.392V7.344l-7.121 4.381a2.393 2.393 0 0 1-2.508 0L1.625 7.344Z"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: color,
          d: "M18.375 5.938v-.126a2.393 2.393 0 0 0-2.393-2.392H4.018a2.393 2.393 0 0 0-2.393 2.392v.126l7.748 4.769a1.196 1.196 0 0 0 1.254 0l7.748-4.769Z"
        }
      )
    );
  }
);
EnvelopeSolid.displayName = "EnvelopeSolid";

export { EnvelopeSolid as default };
//# sourceMappingURL=envelope-solid.js.map
