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
const ShoppingCartSolid = React.forwardRef(
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
          d: "M2.08 2.035a.613.613 0 1 0 0 1.225h1.132c.138 0 .26.093.295.227l2.09 7.836a3.065 3.065 0 0 0-2.292 2.966c0 .338.274.613.612.613h12.867a.612.612 0 1 0 0-1.226H4.634a1.838 1.838 0 0 1 1.734-1.225h9.165a.613.613 0 0 0 .55-.344 49.303 49.303 0 0 0 2.419-5.905.611.611 0 0 0-.43-.788A49.723 49.723 0 0 0 4.883 3.88l-.19-.708a1.532 1.532 0 0 0-1.48-1.137H2.079ZM3.304 16.74a1.225 1.225 0 1 1 2.45 0 1.225 1.225 0 0 1-2.45 0Zm10.416 0a1.225 1.225 0 1 1 2.45 0 1.225 1.225 0 0 1-2.45 0Z"
        }
      )
    );
  }
);
ShoppingCartSolid.displayName = "ShoppingCartSolid";

export { ShoppingCartSolid as default };
//# sourceMappingURL=shopping-cart-solid.js.map
