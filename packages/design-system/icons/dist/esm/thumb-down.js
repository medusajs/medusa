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
const ThumbDown = React.forwardRef(
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
          d: "M6.25 12.5h1.875m6.687-8.125c.009.042.023.083.043.123.492 1 .77 2.125.77 3.314a7.467 7.467 0 0 1-.832 3.438m.019-6.875c-.064-.304.152-.625.479-.625h.756c.741 0 1.428.432 1.644 1.14.282.925.434 1.906.434 2.923 0 1.294-.246 2.53-.692 3.664-.256.646-.905 1.023-1.6 1.023h-.877c-.393 0-.621-.463-.417-.8.09-.147.175-.297.254-.45m.019-6.875h-1.079a3.75 3.75 0 0 1-1.186-.192l-2.594-.866a3.75 3.75 0 0 0-1.186-.192H5.42c-.515 0-1.014.206-1.337.607A9.958 9.958 0 0 0 1.875 10c0 .362.02.72.057 1.07.09.852.856 1.43 1.711 1.43h2.605c.515 0 .826.603.605 1.068a6.226 6.226 0 0 0-.603 2.682 1.875 1.875 0 0 0 1.875 1.875.625.625 0 0 0 .625-.625v-.527c0-.478.092-.95.268-1.394.254-.633.775-1.108 1.378-1.429a7.534 7.534 0 0 0 2.383-2c.415-.528 1.022-.9 1.694-.9h.32"
        }
      )
    );
  }
);
ThumbDown.displayName = "ThumbDown";

export { ThumbDown as default };
//# sourceMappingURL=thumb-down.js.map
