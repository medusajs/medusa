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
const ServerStackSolid = React.forwardRef(
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
          d: "M4.59 3.373A2.5 2.5 0 0 1 6.487 2.5h7.024a2.5 2.5 0 0 1 1.899.873l1.435 1.674A3.776 3.776 0 0 0 16.25 5H3.75c-.202 0-.402.017-.596.047L4.59 3.373Z"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: color,
          fillRule: "evenodd",
          d: "M1.25 8.75a2.5 2.5 0 0 1 2.5-2.5h12.5a2.5 2.5 0 0 1 0 5H3.75a2.5 2.5 0 0 1-2.5-2.5Zm12.5 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm1.875.625a.625.625 0 1 0 0-1.25.625.625 0 0 0 0 1.25ZM3.75 12.5a2.5 2.5 0 0 0 0 5h12.5a2.5 2.5 0 0 0 0-5H3.75Zm9.375 3.125a.624.624 0 1 0 0-1.249.624.624 0 0 0 0 1.249ZM16.25 15a.624.624 0 1 1-1.249 0 .624.624 0 0 1 1.249 0Z",
          clipRule: "evenodd"
        }
      )
    );
  }
);
ServerStackSolid.displayName = "ServerStackSolid";

export { ServerStackSolid as default };
//# sourceMappingURL=server-stack-solid.js.map
