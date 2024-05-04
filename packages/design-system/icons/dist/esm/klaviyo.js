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
const Klaviyo = React.forwardRef(
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
      /* @__PURE__ */ React.createElement("path", { fill: "url(#a)", d: "M19 16H1V4h18l-3.778 6L19 16Z" }),
      /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement(
        "linearGradient",
        {
          id: "a",
          x1: 20.2,
          x2: -1.7,
          y1: 4.835,
          y2: 18.335,
          gradientUnits: "userSpaceOnUse"
        },
        /* @__PURE__ */ React.createElement("stop", { stopColor: "#ED7598" }),
        /* @__PURE__ */ React.createElement("stop", { offset: 0.456, stopColor: "#F75650" }),
        /* @__PURE__ */ React.createElement("stop", { offset: 1, stopColor: "#FFA661" })
      ))
    );
  }
);
Klaviyo.displayName = "Klaviyo";

export { Klaviyo as default };
//# sourceMappingURL=klaviyo.js.map
