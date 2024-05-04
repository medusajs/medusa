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
const PuzzleSolid = React.forwardRef(
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
          d: "M9.375 4.447c0-.295-.155-.563-.334-.799a1.373 1.373 0 0 1-.291-.836c0-.863.84-1.562 1.875-1.562 1.036 0 1.875.7 1.875 1.563 0 .307-.107.594-.29.835-.18.236-.335.504-.335.8 0 .276.232.498.508.481a39.488 39.488 0 0 0 4.694-.563.625.625 0 0 1 .731.537c.189 1.508.294 3.025.314 4.544a.548.548 0 0 1-.55.553c-.295 0-.563-.155-.799-.334a1.372 1.372 0 0 0-.835-.291c-.863 0-1.563.84-1.563 1.875 0 1.036.7 1.875 1.563 1.875.307 0 .594-.107.835-.29.236-.18.504-.335.8-.335.258 0 .464.218.444.476a40.666 40.666 0 0 1-.495 4.037.625.625 0 0 1-.509.509c-1.516.264-3.06.444-4.629.535a.483.483 0 0 1-.509-.484c0-.296.155-.564.334-.8.184-.241.291-.528.291-.835 0-.863-.84-1.563-1.875-1.563-1.036 0-1.875.7-1.875 1.563 0 .307.107.594.29.835.18.236.335.504.335.8a.534.534 0 0 1-.548.535 40.897 40.897 0 0 1-3.924-.3.625.625 0 0 1-.537-.731 39.51 39.51 0 0 0 .524-4.104.442.442 0 0 0-.442-.473c-.296 0-.564.155-.8.334-.241.184-.528.291-.836.291-.863 0-1.562-.84-1.562-1.875 0-1.036.7-1.875 1.563-1.875.307 0 .594.107.835.29.236.18.504.335.8.335a.547.547 0 0 0 .549-.553 39.753 39.753 0 0 0-.259-4.016.625.625 0 0 1 .692-.694c1.12.13 2.253.212 3.398.245a.533.533 0 0 0 .547-.535Z"
        }
      )
    );
  }
);
PuzzleSolid.displayName = "PuzzleSolid";

export { PuzzleSolid as default };
//# sourceMappingURL=puzzle-solid.js.map
