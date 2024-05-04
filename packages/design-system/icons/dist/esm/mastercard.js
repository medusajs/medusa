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
const Mastercard = React.forwardRef(
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
      /* @__PURE__ */ React.createElement("path", { fill: "#FF5A00", d: "M12.428 5.578h-4.87v8.844h4.87V5.578Z" }),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: "#EB001B",
          d: "M7.882 10c0-1.797.835-3.391 2.118-4.422a5.5 5.5 0 0 0-3.434-1.203C3.49 4.375 1 6.891 1 10c0 3.11 2.49 5.625 5.566 5.625A5.5 5.5 0 0 0 10 14.422 5.635 5.635 0 0 1 7.882 10Z"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: "#F79E1B",
          d: "M19 10c0 3.11-2.49 5.625-5.566 5.625A5.5 5.5 0 0 1 10 14.422 5.616 5.616 0 0 0 12.118 10 5.663 5.663 0 0 0 10 5.578a5.492 5.492 0 0 1 3.432-1.203C16.51 4.375 19 6.907 19 10Z"
        }
      )
    );
  }
);
Mastercard.displayName = "Mastercard";

export { Mastercard as default };
//# sourceMappingURL=mastercard.js.map
