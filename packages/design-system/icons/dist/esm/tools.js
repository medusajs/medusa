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
const Tools = React.forwardRef(
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
          d: "m9.525 12.598 4.782 4.783a2.175 2.175 0 0 0 3.076-3.076l-4.82-4.821m-3.038 3.114 2.047-2.485c.26-.315.607-.514.991-.629.451-.134.954-.154 1.43-.114a3.692 3.692 0 0 0 3.68-5.198L14.985 6.86a2.464 2.464 0 0 1-1.845-1.845l2.687-2.688a3.691 3.691 0 0 0-5.197 3.68c.074.883-.059 1.857-.742 2.42l-.084.07m-.28 4.101-3.818 4.637a2.09 2.09 0 1 1-2.942-2.941l5.609-4.618-3.37-3.37H3.849L2.002 3.23 3.232 2 6.31 3.846V5l3.495 3.495-1.432 1.179m6.858 5.552-2.154-2.153M4.15 15.843h.007v.006h-.007v-.006Z"
        }
      )
    );
  }
);
Tools.displayName = "Tools";

export { Tools as default };
//# sourceMappingURL=tools.js.map
