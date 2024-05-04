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
const SparklesMiniSolid = React.forwardRef(
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
          d: "M8 5a.5.5 0 0 1 .48.363l.542 1.897a2.5 2.5 0 0 0 1.717 1.718l1.898.542a.5.5 0 0 1 0 .961l-1.898.542a2.5 2.5 0 0 0-1.717 1.718l-.542 1.897a.5.5 0 0 1-.961 0l-.542-1.897a2.5 2.5 0 0 0-1.718-1.718l-1.897-.542a.5.5 0 0 1 0-.961l1.897-.542A2.5 2.5 0 0 0 6.977 7.26l.542-1.897A.5.5 0 0 1 7.999 5Zm6-2a.5.5 0 0 1 .485.38l.172.69a1.753 1.753 0 0 0 1.273 1.273l.69.172a.5.5 0 0 1 0 .97l-.69.173a1.753 1.753 0 0 0-1.273 1.273l-.172.69a.5.5 0 0 1-.971 0l-.172-.69a1.75 1.75 0 0 0-1.273-1.273l-.691-.172a.5.5 0 0 1 0-.97l.69-.173a1.75 1.75 0 0 0 1.274-1.273l.172-.69a.5.5 0 0 1 .485-.38Zm-1 9a.5.5 0 0 1 .474.342l.263.79a1 1 0 0 0 .632.631l.788.264a.5.5 0 0 1 0 .948l-.788.263a1 1 0 0 0-.632.632l-.264.789a.5.5 0 0 1-.948 0l-.263-.79a1 1 0 0 0-.632-.631l-.789-.263a.5.5 0 0 1 0-.948l.789-.264a1 1 0 0 0 .632-.632l.263-.789a.5.5 0 0 1 .474-.341Z",
          clipRule: "evenodd"
        }
      )
    );
  }
);
SparklesMiniSolid.displayName = "SparklesMiniSolid";

export { SparklesMiniSolid as default };
//# sourceMappingURL=sparkles-mini-solid.js.map
