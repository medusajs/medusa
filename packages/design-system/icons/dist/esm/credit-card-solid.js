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
const CreditCardSolid = React.forwardRef(
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
          d: "M3.976 3.373a2.41 2.41 0 0 0-2.41 2.41v.602h16.868v-.602a2.41 2.41 0 0 0-2.41-2.41H3.976Z"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: color,
          fillRule: "evenodd",
          d: "M18.434 8.193H1.566v6.024a2.41 2.41 0 0 0 2.41 2.41h12.048a2.41 2.41 0 0 0 2.41-2.41V8.193ZM3.976 11.205a.602.602 0 0 1 .602-.602h4.82a.603.603 0 0 1 0 1.205h-4.82a.603.603 0 0 1-.602-.603Zm.602 1.808a.603.603 0 0 0 0 1.204h2.41a.602.602 0 1 0 0-1.204h-2.41Z",
          clipRule: "evenodd"
        }
      )
    );
  }
);
CreditCardSolid.displayName = "CreditCardSolid";

export { CreditCardSolid as default };
//# sourceMappingURL=credit-card-solid.js.map
