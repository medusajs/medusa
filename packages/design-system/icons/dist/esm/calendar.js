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
const Calendar = React.forwardRef(
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
          d: "M5.625 2.5v1.875m8.75-1.875v1.875M2.5 15.625V6.25a1.875 1.875 0 0 1 1.875-1.875h11.25A1.875 1.875 0 0 1 17.5 6.25v9.375m-15 0A1.875 1.875 0 0 0 4.375 17.5h11.25a1.875 1.875 0 0 0 1.875-1.875m-15 0v-6.25A1.875 1.875 0 0 1 4.375 7.5h11.25A1.875 1.875 0 0 1 17.5 9.375v6.25m-7.5-5h.007v.007H10v-.007Zm0 1.875h.007v.007H10V12.5Zm0 1.875h.007v.007H10v-.007ZM8.125 12.5h.007v.007h-.007V12.5Zm0 1.875h.007v.007h-.007v-.007ZM6.25 12.5h.007v.007H6.25V12.5Zm0 1.875h.007v.007H6.25v-.007Zm5.625-3.75h.007v.007h-.007v-.007Zm0 1.875h.007v.007h-.007V12.5Zm0 1.875h.007v.007h-.007v-.007Zm1.875-3.75h.007v.007h-.007v-.007Zm0 1.875h.007v.007h-.007V12.5Z"
        }
      )
    );
  }
);
Calendar.displayName = "Calendar";

export { Calendar as default };
//# sourceMappingURL=calendar.js.map
