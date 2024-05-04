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
const Cash = React.forwardRef(
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
          d: "M2 14.967a49.288 49.288 0 0 1 12.962 1.724.94.94 0 0 0 1.192-.9v-.824M3.23 3.275v.615a.615.615 0 0 1-.616.616H2m0 0v-.308c0-.51.414-.923.923-.923H16.77M2 4.505v7.385m14.77-8.615v.615c0 .34.275.616.615.616H18m-1.23-1.231h.307c.51 0 .923.413.923.923v8c0 .51-.413.923-.923.923h-.308M2 11.891v.307a.923.923 0 0 0 .923.923h.308M2 11.891h.615a.615.615 0 0 1 .616.615v.615m13.538 0v-.615a.616.616 0 0 1 .616-.616H18m-1.23 1.231H3.23m9.231-4.923a2.462 2.462 0 1 1-4.923 0 2.462 2.462 0 0 1 4.923 0Zm2.462 0h.007v.007h-.007v-.007Zm-9.846 0h.006v.007h-.006v-.007Z"
        }
      )
    );
  }
);
Cash.displayName = "Cash";

export { Cash as default };
//# sourceMappingURL=cash.js.map
