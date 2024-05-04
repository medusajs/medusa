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
const Sparkles = React.forwardRef(
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
          d: "M8.178 13.253 7.5 15.625l-.678-2.372a3.75 3.75 0 0 0-2.575-2.575L1.875 10l2.372-.678a3.75 3.75 0 0 0 2.575-2.574L7.5 4.374l.678 2.372a3.75 3.75 0 0 0 2.574 2.575l2.373.678-2.372.678a3.75 3.75 0 0 0-2.575 2.574v.001Zm7.038-5.99L15 8.124l-.216-.862a2.813 2.813 0 0 0-2.046-2.047L11.875 5l.863-.216a2.813 2.813 0 0 0 2.046-2.046L15 1.874l.216.862a2.813 2.813 0 0 0 2.046 2.047l.863.216-.863.216a2.812 2.812 0 0 0-2.046 2.046Zm-1.138 9.876-.328.986-.328-.986a1.875 1.875 0 0 0-1.186-1.186l-.986-.328.986-.328a1.875 1.875 0 0 0 1.186-1.186l.328-.986.328.986a1.875 1.875 0 0 0 1.186 1.186l.986.328-.986.328a1.875 1.875 0 0 0-1.186 1.186Z"
        }
      )
    );
  }
);
Sparkles.displayName = "Sparkles";

export { Sparkles as default };
//# sourceMappingURL=sparkles.js.map
