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
const Loader = React.forwardRef(
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
          d: "M10 6a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 1 1.5 0v2.5A.75.75 0 0 1 10 6Z"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: color,
          d: "M13.359 7.391a.75.75 0 0 1-.53-1.281l1.768-1.768a.75.75 0 1 1 1.061 1.061L13.89 7.171a.75.75 0 0 1-.531.22Z",
          opacity: 0.88
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: color,
          d: "M17.25 10.75h-2.5a.75.75 0 0 1 0-1.5h2.5a.75.75 0 0 1 0 1.5Z",
          opacity: 0.75
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: color,
          d: "M15.126 15.876a.744.744 0 0 1-.53-.22l-1.768-1.768a.75.75 0 1 1 1.061-1.061l1.768 1.768a.75.75 0 0 1-.531 1.28Z",
          opacity: 0.63
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: color,
          d: "M10 18a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 1 1.5 0v2.5A.75.75 0 0 1 10 18Z",
          opacity: 0.5
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: color,
          d: "M4.874 15.876a.75.75 0 0 1-.53-1.281l1.768-1.768a.75.75 0 1 1 1.061 1.06l-1.768 1.769a.75.75 0 0 1-.531.22Z",
          opacity: 0.38
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: color,
          d: "M5.25 10.75h-2.5a.75.75 0 0 1 0-1.5h2.5a.75.75 0 0 1 0 1.5Z",
          opacity: 0.25
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: color,
          d: "M6.641 7.391a.744.744 0 0 1-.53-.22L4.343 5.403a.75.75 0 1 1 1.061-1.06L7.172 6.11a.75.75 0 0 1-.53 1.281h-.001Z",
          opacity: 0.13
        }
      )
    );
  }
);
Loader.displayName = "Loader";

export { Loader as default };
//# sourceMappingURL=loader.js.map
