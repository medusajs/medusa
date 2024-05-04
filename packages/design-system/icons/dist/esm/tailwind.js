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
const Tailwind = React.forwardRef(
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
        "mask",
        {
          id: "a",
          width: 18,
          height: 12,
          x: 1,
          y: 4,
          maskUnits: "userSpaceOnUse",
          style: {
            maskType: "luminance"
          }
        },
        /* @__PURE__ */ React.createElement("path", { fill: "#fff", d: "M1 4.6h18v10.8H1V4.6Z" })
      ),
      /* @__PURE__ */ React.createElement("g", { mask: "url(#a)" }, /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: "#38BDF8",
          fillRule: "evenodd",
          d: "M10 4.6c-2.4 0-3.9 1.2-4.5 3.6.9-1.2 1.95-1.65 3.15-1.35.685.171 1.174.668 1.716 1.218C11.248 8.963 12.269 10 14.5 10c2.4 0 3.9-1.2 4.5-3.6-.9 1.2-1.95 1.65-3.15 1.35-.685-.17-1.174-.668-1.716-1.218C13.252 5.637 12.231 4.6 10 4.6ZM5.5 10c-2.4 0-3.9 1.2-4.5 3.6.9-1.2 1.95-1.65 3.15-1.35.685.171 1.174.668 1.716 1.218.882.895 1.903 1.932 4.134 1.932 2.4 0 3.9-1.2 4.5-3.6-.9 1.2-1.95 1.65-3.15 1.35-.685-.17-1.174-.668-1.716-1.218C8.752 11.037 7.731 10 5.5 10Z",
          clipRule: "evenodd"
        }
      ))
    );
  }
);
Tailwind.displayName = "Tailwind";

export { Tailwind as default };
//# sourceMappingURL=tailwind.js.map
