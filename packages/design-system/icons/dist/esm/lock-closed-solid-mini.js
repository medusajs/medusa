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
const LockClosedSolidMini = React.forwardRef(
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
          d: "M12.889 10a.667.667 0 0 1-.667-.667V6.444A2.225 2.225 0 0 0 10 4.222a2.225 2.225 0 0 0-2.222 2.222v2.89a.667.667 0 0 1-1.334 0v-2.89A3.56 3.56 0 0 1 10 2.89a3.56 3.56 0 0 1 3.556 3.555v2.89a.667.667 0 0 1-.667.666Z"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: color,
          d: "M13.333 8.667H6.667a2.446 2.446 0 0 0-2.445 2.444v3.556a2.446 2.446 0 0 0 2.445 2.444h6.666a2.447 2.447 0 0 0 2.445-2.444V11.11a2.446 2.446 0 0 0-2.445-2.444Zm-2.666 4.666a.667.667 0 0 1-1.334 0v-.889a.667.667 0 0 1 1.334 0v.89Z"
        }
      )
    );
  }
);
LockClosedSolidMini.displayName = "LockClosedSolidMini";

export { LockClosedSolidMini as default };
//# sourceMappingURL=lock-closed-solid-mini.js.map
