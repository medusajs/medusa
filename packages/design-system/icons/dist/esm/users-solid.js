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
const UsersSolid = React.forwardRef(
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
          d: "M4.018 5.513a3.29 3.29 0 1 1 6.58 0 3.29 3.29 0 0 1-6.58 0Zm7.776 1.795a2.692 2.692 0 1 1 5.384 0 2.692 2.692 0 0 1-5.384 0ZM1.625 15.683a5.683 5.683 0 0 1 11.366 0v.097a.598.598 0 0 1-.29.503 10.423 10.423 0 0 1-5.393 1.494c-1.972 0-3.817-.546-5.392-1.494a.598.598 0 0 1-.29-.503l-.001-.097Zm12.562.002v.115a1.794 1.794 0 0 1-.186.766 8.047 8.047 0 0 0 4.036-.806.6.6 0 0 0 .335-.513 3.89 3.89 0 0 0-5.55-3.677 6.848 6.848 0 0 1 1.365 4.113v.002Z"
        }
      )
    );
  }
);
UsersSolid.displayName = "UsersSolid";

export { UsersSolid as default };
//# sourceMappingURL=users-solid.js.map
