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
const GlobeEurope = React.forwardRef(
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
          d: "m17.41 11.16-.945-.945a1.875 1.875 0 0 1-.35-.487l-.9-1.8a.346.346 0 0 0-.553-.09.69.69 0 0 1-.677.175l-1.06-.302a.742.742 0 0 0-.616 1.33l.49.324a.938.938 0 0 1 .143 1.443l-.167.167a.937.937 0 0 0-.275.663v.342c0 .34-.092.674-.267.965l-1.096 1.826a1.759 1.759 0 0 1-1.508.854.88.88 0 0 1-.879-.88v-.976c0-.766-.467-1.456-1.178-1.74l-.546-.218a1.875 1.875 0 0 1-1.153-2.05l.006-.035c.039-.232.12-.454.242-.656l.075-.125a1.875 1.875 0 0 1 1.975-.873l.982.196a.938.938 0 0 0 1.085-.662l.173-.608a.937.937 0 0 0-.482-1.096l-.554-.277-.076.076a1.875 1.875 0 0 1-1.326.55h-.15a.784.784 0 0 0-.551.227.776.776 0 0 1-1.215-.947l1.175-1.96c.118-.196.198-.41.239-.634m9.94 8.224A7.499 7.499 0 1 0 2.594 8.834a7.499 7.499 0 0 0 14.817 2.327Z"
        }
      )
    );
  }
);
GlobeEurope.displayName = "GlobeEurope";

export { GlobeEurope as default };
//# sourceMappingURL=globe-europe.js.map
