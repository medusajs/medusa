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
const CalendarMini = React.forwardRef(
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
          d: "M6.5 4v1.5m7-1.5v1.5m-9.5 9V7a1.5 1.5 0 0 1 1.5-1.5h9A1.5 1.5 0 0 1 16 7v7.5m-12 0A1.5 1.5 0 0 0 5.5 16h9a1.5 1.5 0 0 0 1.5-1.5m-12 0v-5A1.5 1.5 0 0 1 5.5 8h9A1.5 1.5 0 0 1 16 9.5v5"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          stroke: color,
          strokeWidth: 0.75,
          d: "M7.875 10.868a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM7.875 13.194a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM12.875 10.868a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM10.375 10.868a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM10.375 13.194a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
        }
      )
    );
  }
);
CalendarMini.displayName = "CalendarMini";

export { CalendarMini as default };
//# sourceMappingURL=calendar-mini.js.map
