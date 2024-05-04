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
const Camera = React.forwardRef(
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
          d: "M5.69 5.146a1.925 1.925 0 0 1-1.368.879c-.317.045-.631.093-.945.146-.878.146-1.502.918-1.502 1.807V15a1.875 1.875 0 0 0 1.875 1.875h12.5A1.875 1.875 0 0 0 18.125 15V7.978c0-.889-.625-1.661-1.502-1.807-.314-.053-.63-.101-.945-.146a1.925 1.925 0 0 1-1.366-.88l-.685-1.096a1.827 1.827 0 0 0-1.447-.866 40.643 40.643 0 0 0-4.36 0 1.827 1.827 0 0 0-1.447.866L5.69 5.146Z"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          stroke: color,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 1.5,
          d: "M13.75 10.625a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Zm1.875-1.875h.007v.007h-.007V8.75Z"
        }
      )
    );
  }
);
Camera.displayName = "Camera";

export { Camera as default };
//# sourceMappingURL=camera.js.map
