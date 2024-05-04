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
const PhotoSolid = React.forwardRef(
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
          d: "M1.25 5a1.875 1.875 0 0 1 1.875-1.875h13.75A1.875 1.875 0 0 1 18.75 5v10a1.875 1.875 0 0 1-1.875 1.875H3.125A1.875 1.875 0 0 1 1.25 15V5Zm1.25 8.383V15c0 .345.28.625.625.625h13.75A.624.624 0 0 0 17.5 15v-1.617l-2.242-2.24a1.25 1.25 0 0 0-1.766 0l-.734.732.809.808a.627.627 0 0 1 .015.9.623.623 0 0 1-.899-.016l-4.3-4.3a1.25 1.25 0 0 0-1.766 0L2.5 13.384Zm8.438-6.508a.938.938 0 1 1 1.875 0 .938.938 0 0 1-1.876 0Z",
          clipRule: "evenodd"
        }
      )
    );
  }
);
PhotoSolid.displayName = "PhotoSolid";

export { PhotoSolid as default };
//# sourceMappingURL=photo-solid.js.map
