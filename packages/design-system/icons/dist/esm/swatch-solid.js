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
const SwatchSolid = React.forwardRef(
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
          d: "M1.875 3.438c0-.864.7-1.563 1.563-1.563h4.374c.864 0 1.563.7 1.563 1.563v10.937a3.75 3.75 0 1 1-7.5 0V3.437Zm3.75 11.874a.938.938 0 1 0 0-1.875.938.938 0 0 0 0 1.876Z",
          clipRule: "evenodd"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: color,
          d: "M8.932 18.125h7.63c.864 0 1.563-.7 1.563-1.563v-4.375c0-.863-.7-1.562-1.563-1.562h-.116L9.16 17.91c-.075.074-.15.146-.229.214Zm1.683-3.438 5.395-5.395a1.562 1.562 0 0 0 0-2.209L12.917 3.99a1.563 1.563 0 0 0-2.21 0l-.083.083v10.303c0 .105-.002.21-.008.312h-.001Z"
        }
      )
    );
  }
);
SwatchSolid.displayName = "SwatchSolid";

export { SwatchSolid as default };
//# sourceMappingURL=swatch-solid.js.map
