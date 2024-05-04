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
const Bug = React.forwardRef(
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
          d: "M10 10.615c.942 0 1.868.066 2.774.195.85.12 1.53.792 1.53 1.65 0 3.056-1.927 5.534-4.304 5.534-2.378 0-4.304-2.478-4.304-5.534 0-.858.68-1.53 1.53-1.65.92-.13 1.846-.195 2.774-.195Zm0 0c2.364 0 4.63.417 6.729 1.18a19.604 19.604 0 0 1-.944 4.97M10 10.614c-2.363 0-4.63.417-6.729 1.18.103 1.726.426 3.392.945 4.97M10 10.614a1.845 1.845 0 0 0 1.843-1.93M10 10.615a1.845 1.845 0 0 1-1.843-1.93m3.686 0A1.845 1.845 0 0 0 10 6.926m1.843 1.76a19.586 19.586 0 0 0 4.283-.888 19.735 19.735 0 0 0-.321-2.717M8.157 8.685A1.845 1.845 0 0 1 10 6.926m-1.843 1.76a19.578 19.578 0 0 1-4.282-.888c.044-.912.152-1.82.322-2.717M10 6.926c.816 0 1.616-.066 2.396-.193.33-.055.607-.294.652-.625a3.098 3.098 0 0 0-.327-1.845M10 6.926c-.816 0-1.616-.066-2.396-.193-.33-.055-.607-.294-.652-.625a3.061 3.061 0 0 1 .328-1.847m0 0a4.94 4.94 0 0 1-.947-.821 3.662 3.662 0 0 1 .47-1.432m.477 2.253a3.072 3.072 0 0 1 4.308-1.199c.48.29.87.704 1.132 1.2.35-.233.668-.509.947-.82a3.666 3.666 0 0 0-.472-1.436"
        }
      )
    );
  }
);
Bug.displayName = "Bug";

export { Bug as default };
//# sourceMappingURL=bug.js.map
