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
const Medusa = React.forwardRef(
  (props, ref) => {
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
          fill: "#030712",
          d: "m16.245 3.922-4.076-2.345a4.297 4.297 0 0 0-4.301 0L3.773 3.922a4.331 4.331 0 0 0-2.141 3.714v4.709c0 1.538.826 2.945 2.14 3.714l4.077 2.364c1.333.77 2.967.77 4.301 0l4.076-2.364a4.269 4.269 0 0 0 2.141-3.714V7.636c.038-1.52-.789-2.945-2.122-3.714Zm-6.236 10.261A4.19 4.19 0 0 1 5.82 10a4.19 4.19 0 0 1 4.189-4.183c2.31 0 4.207 1.876 4.207 4.183s-1.878 4.183-4.207 4.183Z"
        }
      )
    );
  }
);
Medusa.displayName = "Medusa";

export { Medusa as default };
//# sourceMappingURL=medusa.js.map
