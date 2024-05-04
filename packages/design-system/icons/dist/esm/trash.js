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
const Trash = React.forwardRef(
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
          d: "m12.283 7.5-.288 7.5m-3.99 0-.288-7.5m8.306-2.675c.285.043.569.09.852.138m-.852-.137-.89 11.568a1.875 1.875 0 0 1-1.87 1.73H6.737a1.875 1.875 0 0 1-1.87-1.73l-.89-11.569m12.046 0a40.08 40.08 0 0 0-2.898-.33m-10 .467c.283-.049.567-.095.852-.137m0 0a40.091 40.091 0 0 1 2.898-.33m6.25 0V3.73c0-.984-.758-1.804-1.742-1.834a43.3 43.3 0 0 0-2.766 0c-.984.03-1.742.851-1.742 1.834v.763m6.25 0c-2.08-.16-4.17-.16-6.25 0"
        }
      )
    );
  }
);
Trash.displayName = "Trash";

export { Trash as default };
//# sourceMappingURL=trash.js.map
