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
const Klarna = React.forwardRef(
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
      /* @__PURE__ */ React.createElement("path", { fill: "#FFB3C7", d: "M10 19a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" }),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: "#000",
          d: "M12.041 6.137h-1.64A4.159 4.159 0 0 1 8.723 9.49l-.641.476 2.492 3.397h2.045l-2.293-3.108a5.734 5.734 0 0 0 1.715-4.118ZM7.874 6.137H6.211v7.234h1.663V6.137Z"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: "#000",
          d: "M13.713 11.293a1.096 1.096 0 1 0-.001 2.191 1.096 1.096 0 0 0 .001-2.191Z"
        }
      )
    );
  }
);
Klarna.displayName = "Klarna";

export { Klarna as default };
//# sourceMappingURL=klarna.js.map
