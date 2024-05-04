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
const DocumentText = React.forwardRef(
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
          d: "M16.25 11.846V9.692c0-.734-.296-1.438-.824-1.958a2.835 2.835 0 0 0-1.989-.81h-1.25a.945.945 0 0 1-.662-.271A.916.916 0 0 1 11.25 6V4.77c0-.735-.296-1.44-.824-1.959A2.835 2.835 0 0 0 8.437 2H6.875m0 10.461h6.25m-6.25 2.462H10M8.75 2H4.687a.93.93 0 0 0-.937.923v14.154c0 .51.42.923.938.923h10.625a.93.93 0 0 0 .937-.923V9.385c0-1.959-.79-3.837-2.197-5.222A7.56 7.56 0 0 0 8.75 2v0Z"
        }
      )
    );
  }
);
DocumentText.displayName = "DocumentText";

export { DocumentText as default };
//# sourceMappingURL=document-text.js.map
