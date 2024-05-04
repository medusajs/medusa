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
const DocumentSeries = React.forwardRef(
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
          d: "M13.125 14.375v2.813c0 .517-.42.937-.938.937H4.063a.938.938 0 0 1-.938-.938V6.563c0-.517.42-.937.938-.937h1.562c.419 0 .837.034 1.25.103m6.25 8.647h2.813c.517 0 .937-.42.937-.938V9.375a7.502 7.502 0 0 0-7.5-7.5H7.812a.938.938 0 0 0-.937.938v2.915m6.25 8.647H7.812a.938.938 0 0 1-.937-.938V5.729m10 5.522V9.687a2.812 2.812 0 0 0-2.813-2.812h-1.25a.937.937 0 0 1-.937-.938v-1.25a2.811 2.811 0 0 0-2.813-2.812h-.937"
        }
      )
    );
  }
);
DocumentSeries.displayName = "DocumentSeries";

export { DocumentSeries as default };
//# sourceMappingURL=document-series.js.map
