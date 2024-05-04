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
const Facebook = React.forwardRef(
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
          fill: "url(#a)",
          fillRule: "evenodd",
          d: "M1 10c0 4.455 3.24 8.145 7.515 8.91l.053-.044-.008-.001V12.52H6.31V10h2.25V8.02c0-2.25 1.44-3.51 3.51-3.51.63 0 1.35.09 1.98.18v2.295h-1.17c-1.08 0-1.35.54-1.35 1.26V10h2.385l-.405 2.52h-1.98v6.345l-.082.015.037.03C15.76 18.145 19 14.455 19 10c0-4.95-4.05-9-9-9s-9 4.05-9 9Z",
          clipRule: "evenodd"
        }
      ),
      /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement(
        "linearGradient",
        {
          id: "a",
          x1: 10,
          x2: 10,
          y1: 18.374,
          y2: 0.997,
          gradientUnits: "userSpaceOnUse"
        },
        /* @__PURE__ */ React.createElement("stop", { stopColor: "#0062E0" }),
        /* @__PURE__ */ React.createElement("stop", { offset: 1, stopColor: "#19AFFF" })
      ))
    );
  }
);
Facebook.displayName = "Facebook";

export { Facebook as default };
//# sourceMappingURL=facebook.js.map
