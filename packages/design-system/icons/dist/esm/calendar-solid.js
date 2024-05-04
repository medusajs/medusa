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
const CalendarSolid = React.forwardRef(
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
          d: "M10.625 10.625a.624.624 0 1 1-1.249 0 .624.624 0 0 1 1.249 0Zm-4.375 2.5a.625.625 0 1 0 0-1.25.625.625 0 0 0 0 1.25Zm.625 1.25a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm1.25-1.25a.625.625 0 1 0 0-1.25.625.625 0 0 0 0 1.25Zm.625 1.25a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm1.25-1.25a.624.624 0 1 0 0-1.249.624.624 0 0 0 0 1.249Zm.625 1.25a.624.624 0 1 1-1.249 0 .624.624 0 0 1 1.249 0Zm1.25-1.25a.624.624 0 1 0 0-1.249.624.624 0 0 0 0 1.249Zm.625 1.25a.624.624 0 1 1-1.249 0 .624.624 0 0 1 1.249 0Zm1.25-1.25a.624.624 0 1 0 0-1.249.624.624 0 0 0 0 1.249Zm-1.25-2.5a.624.624 0 1 1-1.249 0 .624.624 0 0 1 1.249 0Zm1.25.625a.624.624 0 1 0 0-1.249.624.624 0 0 0 0 1.249Z"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: color,
          fillRule: "evenodd",
          d: "M5.625 1.875a.625.625 0 0 1 .625.625v1.25h7.5V2.5a.625.625 0 1 1 1.25 0v1.25h.625a2.5 2.5 0 0 1 2.5 2.5v9.375a2.5 2.5 0 0 1-2.5 2.5H4.375a2.5 2.5 0 0 1-2.5-2.5V6.25a2.5 2.5 0 0 1 2.5-2.5H5V2.5a.625.625 0 0 1 .625-.625Zm11.25 7.5a1.25 1.25 0 0 0-1.25-1.25H4.375a1.25 1.25 0 0 0-1.25 1.25v6.25a1.25 1.25 0 0 0 1.25 1.25h11.25a1.25 1.25 0 0 0 1.25-1.25v-6.25Z",
          clipRule: "evenodd"
        }
      )
    );
  }
);
CalendarSolid.displayName = "CalendarSolid";

export { CalendarSolid as default };
//# sourceMappingURL=calendar-solid.js.map
