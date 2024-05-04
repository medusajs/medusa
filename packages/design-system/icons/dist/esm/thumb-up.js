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
const ThumbUp = React.forwardRef(
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
          d: "M5.527 8.75c.672 0 1.278-.372 1.693-.9a7.534 7.534 0 0 1 2.384-2c.603-.32 1.125-.797 1.378-1.43.177-.442.268-.915.268-1.393V2.5a.625.625 0 0 1 .625-.625A1.875 1.875 0 0 1 13.75 3.75c0 .96-.217 1.87-.602 2.682-.222.465.089 1.068.604 1.068h2.605c.855 0 1.62.578 1.711 1.43a9.959 9.959 0 0 1-2.15 7.338c-.324.401-.823.607-1.338.607h-3.347c-.402 0-.803-.065-1.186-.192l-2.595-.866a3.751 3.751 0 0 0-1.185-.192H4.92m0 0c.07.17.144.338.225.502.164.333-.065.748-.436.748h-.756c-.741 0-1.428-.432-1.644-1.14a10 10 0 0 1-.434-2.922c0-1.295.246-2.53.692-3.665.255-.646.905-1.023 1.6-1.023h.877c.394 0 .621.463.417.8a7.465 7.465 0 0 0-1.085 3.887c0 .995.193 1.945.545 2.813H4.92ZM11.875 7.5h1.875"
        }
      )
    );
  }
);
ThumbUp.displayName = "ThumbUp";

export { ThumbUp as default };
//# sourceMappingURL=thumb-up.js.map
