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
const Puzzle = React.forwardRef(
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
          d: "M11.875 5.072c0-.295.155-.563.334-.799.184-.241.291-.528.291-.835 0-.864-.84-1.563-1.875-1.563-1.036 0-1.875.7-1.875 1.563 0 .307.107.594.29.835.18.236.335.504.335.8a.533.533 0 0 1-.547.535 40.325 40.325 0 0 1-3.47-.25c.155 1.345.245 2.709.263 4.09a.547.547 0 0 1-.549.552c-.295 0-.563-.155-.799-.334a1.373 1.373 0 0 0-.835-.291c-.864 0-1.563.84-1.563 1.875 0 1.036.7 1.875 1.563 1.875.307 0 .594-.107.835-.29.236-.18.504-.335.8-.335.258 0 .462.217.443.475a40.032 40.032 0 0 1-.535 4.213c1.265.159 2.548.258 3.847.295a.533.533 0 0 0 .547-.535c0-.296-.155-.564-.334-.8a1.372 1.372 0 0 1-.291-.835c0-.863.84-1.563 1.875-1.563 1.036 0 1.875.7 1.875 1.563 0 .307-.107.594-.29.835-.18.236-.334.504-.334.8 0 .277.23.499.508.483a40.055 40.055 0 0 0 4.523-.525c.226-1.302.388-2.613.485-3.931a.444.444 0 0 0-.444-.475c-.296 0-.564.155-.8.334-.241.184-.528.291-.835.291-.863 0-1.563-.84-1.563-1.875 0-1.036.7-1.875 1.563-1.875.308 0 .594.107.835.29.236.18.504.335.8.335a.547.547 0 0 0 .549-.553 40.36 40.36 0 0 0-.309-4.466 40.114 40.114 0 0 1-4.805.574.482.482 0 0 1-.508-.482Z"
        }
      )
    );
  }
);
Puzzle.displayName = "Puzzle";

export { Puzzle as default };
//# sourceMappingURL=puzzle.js.map
