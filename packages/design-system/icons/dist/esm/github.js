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
const Github = React.forwardRef(
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
          fill: "#1B1F23",
          fillRule: "evenodd",
          d: "M10 1.222c-4.973 0-9 4.028-9 9a8.994 8.994 0 0 0 6.154 8.539c.45.079.619-.191.619-.428 0-.213-.012-.922-.012-1.676-2.261.416-2.846-.551-3.026-1.057-.101-.26-.54-1.058-.923-1.272-.314-.168-.764-.585-.01-.596.708-.011 1.214.652 1.383.923.81 1.36 2.104.978 2.621.742.079-.585.315-.979.574-1.204-2.003-.225-4.095-1.001-4.095-4.443 0-.98.349-1.79.922-2.42-.09-.224-.404-1.147.09-2.384 0 0 .754-.236 2.476.922a8.351 8.351 0 0 1 2.25-.303c.764 0 1.53.1 2.25.303 1.72-1.17 2.475-.922 2.475-.922.495 1.237.18 2.16.09 2.385.573.63.922 1.429.922 2.419 0 3.453-2.104 4.218-4.106 4.443.326.282.607.822.607 1.665 0 1.204-.011 2.171-.011 2.475 0 .237.169.518.619.428A9.014 9.014 0 0 0 19 10.222c0-4.972-4.027-9-9-9Z",
          clipRule: "evenodd"
        }
      )
    );
  }
);
Github.displayName = "Github";

export { Github as default };
//# sourceMappingURL=github.js.map
