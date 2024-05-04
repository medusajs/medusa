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
const Gift = React.forwardRef(
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
          stroke: color,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 1.5,
          d: "M16.815 9.7v6.6c0 .318-.125.623-.347.848a1.178 1.178 0 0 1-.838.352H4.37c-.314 0-.615-.126-.838-.352a1.207 1.207 0 0 1-.347-.848V9.7m6.519-5.1c0-.415-.122-.821-.35-1.167a2.08 2.08 0 0 0-.93-.773 2.05 2.05 0 0 0-2.261.455 2.124 2.124 0 0 0-.45 2.289c.157.383.423.711.764.942.341.23.742.354 1.153.354h2.074m0-2.1v2.1m0-2.1c0-.415.121-.821.35-1.167a2.08 2.08 0 0 1 .93-.773 2.05 2.05 0 0 1 2.26.455 2.124 2.124 0 0 1 .45 2.289 2.095 2.095 0 0 1-.764.942c-.341.23-.742.354-1.152.354H9.704m0 0v10.8M2.889 9.7H17.11c.49 0 .889-.403.889-.9V7.6c0-.497-.398-.9-.889-.9H2.89A.895.895 0 0 0 2 7.6v1.2c0 .497.398.9.889.9Z"
        }
      )
    );
  }
);
Gift.displayName = "Gift";

export { Gift as default };
//# sourceMappingURL=gift.js.map
