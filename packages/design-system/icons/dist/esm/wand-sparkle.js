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
const WandSparkle = React.forwardRef(
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
      /* @__PURE__ */ React.createElement("g", { clipPath: "url(#a)" }, /* @__PURE__ */ React.createElement(
        "path",
        {
          stroke: color,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 1.5,
          d: "M14.107 3.393 3.381 14.119a1.111 1.111 0 0 0 0 1.572l.928.928a1.111 1.111 0 0 0 1.572 0L16.607 5.893a1.111 1.111 0 0 0 0-1.572l-.928-.928a1.111 1.111 0 0 0-1.572 0ZM11.541 5.959l2.5 2.5"
        }
      ), /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: color,
          d: "m8.048 3.88-1.051-.35-.351-1.052c-.114-.34-.677-.34-.79 0L5.504 3.53l-1.05.35a.417.417 0 0 0 0 .791l1.05.35.352 1.052a.416.416 0 0 0 .788 0l.352-1.052 1.05-.35a.417.417 0 0 0 .002-.791ZM18.509 13.322l-1.404-.468-.467-1.403c-.153-.453-.903-.453-1.055 0l-.467 1.403-1.404.468a.556.556 0 0 0 0 1.054l1.404.467.467 1.404a.557.557 0 0 0 1.056 0l.468-1.404 1.403-.467a.555.555 0 0 0-.001-1.054ZM10.278 2.778a.833.833 0 1 0 0-1.667.833.833 0 0 0 0 1.667Z"
        }
      )),
      /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("clipPath", { id: "a" }, /* @__PURE__ */ React.createElement("path", { fill: "#fff", d: "M0 0h20v20H0z" })))
    );
  }
);
WandSparkle.displayName = "WandSparkle";

export { WandSparkle as default };
//# sourceMappingURL=wand-sparkle.js.map
