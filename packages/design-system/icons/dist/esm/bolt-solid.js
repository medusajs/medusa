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
const BoltSolid = React.forwardRef(
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
          d: "M12.034 1.577a.6.6 0 0 1 .254.295.63.63 0 0 1 .025.394l-1.55 5.912h5.654c.113 0 .225.035.32.1a.6.6 0 0 1 .215.266.63.63 0 0 1-.11.656l-8.166 9.107a.564.564 0 0 1-.711.116.6.6 0 0 1-.254-.296.63.63 0 0 1-.024-.395l1.55-5.911H3.582a.567.567 0 0 1-.32-.1.602.602 0 0 1-.215-.265.63.63 0 0 1 .11-.657l8.166-9.106a.564.564 0 0 1 .71-.116Z",
          clipRule: "evenodd"
        }
      )
    );
  }
);
BoltSolid.displayName = "BoltSolid";

export { BoltSolid as default };
//# sourceMappingURL=bolt-solid.js.map
