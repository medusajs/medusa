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
const DocumentTextSolid = React.forwardRef(
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
          d: "M4.915 1.625c-.826 0-1.495.67-1.495 1.496v13.758c0 .826.67 1.496 1.495 1.496h10.17c.825 0 1.495-.67 1.495-1.495v-6.282a2.99 2.99 0 0 0-2.99-2.99h-1.496a1.495 1.495 0 0 1-1.496-1.496V4.616a2.991 2.991 0 0 0-2.99-2.991H4.914Zm1.496 10.768a.598.598 0 0 1 .598-.598h5.982a.598.598 0 0 1 0 1.196H7.01a.599.599 0 0 1-.598-.598Zm.598 1.794a.598.598 0 1 0 0 1.197H10a.598.598 0 1 0 0-1.197H7.009Z",
          clipRule: "evenodd"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: color,
          d: "M10.774 1.877a4.171 4.171 0 0 1 1.02 2.74v1.495a.3.3 0 0 0 .3.299h1.495a4.172 4.172 0 0 1 2.74 1.02 7.792 7.792 0 0 0-5.555-5.554Z"
        }
      )
    );
  }
);
DocumentTextSolid.displayName = "DocumentTextSolid";

export { DocumentTextSolid as default };
//# sourceMappingURL=document-text-solid.js.map
