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
const KeySolid = React.forwardRef(
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
          fillRule: "evenodd",
          d: "M13.125 1.25a5.625 5.625 0 0 0-5.543 6.588c.056.325-.026.598-.184.755L1.982 14.01a2.5 2.5 0 0 0-.732 1.768v2.348c0 .345.28.625.625.625H5a.625.625 0 0 0 .625-.625v-1.25h1.25a.625.625 0 0 0 .625-.625V15h1.25a.625.625 0 0 0 .442-.183l2.215-2.215c.158-.158.43-.24.755-.184a5.624 5.624 0 1 0 .963-11.168Zm0 2.5a.625.625 0 1 0 0 1.25A1.875 1.875 0 0 1 15 6.875a.625.625 0 1 0 1.25 0 3.125 3.125 0 0 0-3.125-3.125Z",
          clipRule: "evenodd"
        }
      )
    );
  }
);
KeySolid.displayName = "KeySolid";

export { KeySolid as default };
//# sourceMappingURL=key-solid.js.map
