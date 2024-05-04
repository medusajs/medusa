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
const CogSixToothSolid = React.forwardRef(
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
          d: "M9.232 1.875c-.765 0-1.416.553-1.542 1.306l-.148.893c-.017.1-.096.217-.248.29-.285.137-.56.296-.822.475-.138.096-.278.105-.375.07L5.25 4.59a1.563 1.563 0 0 0-1.902.683l-.768 1.33a1.563 1.563 0 0 0 .36 1.988l.7.577c.08.065.142.19.128.358a6.334 6.334 0 0 0 0 .949c.013.167-.049.293-.127.358l-.701.577a1.562 1.562 0 0 0-.36 1.988l.768 1.33a1.562 1.562 0 0 0 1.902.682l.85-.318c.095-.036.235-.026.374.068.26.178.534.338.821.475.152.073.23.19.247.292l.149.892a1.563 1.563 0 0 0 1.541 1.306h1.537c.764 0 1.416-.552 1.542-1.306l.148-.893c.017-.1.095-.217.248-.291.286-.137.56-.297.82-.475.14-.095.28-.104.376-.068l.85.318a1.562 1.562 0 0 0 1.9-.683l.769-1.33a1.563 1.563 0 0 0-.36-1.988l-.7-.577c-.08-.065-.142-.19-.129-.358a6.345 6.345 0 0 0 0-.949c-.013-.167.05-.293.128-.358l.7-.577c.59-.485.742-1.325.36-1.987l-.768-1.331a1.562 1.562 0 0 0-1.901-.682l-.85.318c-.095.036-.235.026-.374-.069a6.246 6.246 0 0 0-.821-.475c-.153-.072-.231-.189-.248-.29l-.149-.893a1.563 1.563 0 0 0-1.542-1.306H9.232ZM10 13.125a3.125 3.125 0 1 0 0-6.25 3.125 3.125 0 0 0 0 6.25Z",
          clipRule: "evenodd"
        }
      )
    );
  }
);
CogSixToothSolid.displayName = "CogSixToothSolid";

export { CogSixToothSolid as default };
//# sourceMappingURL=cog-six-tooth-solid.js.map
