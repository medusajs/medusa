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
const AcademicCapSolid = React.forwardRef(
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
          d: "M9.679 1.93a.717.717 0 0 1 .642 0 39.23 39.23 0 0 1 7.832 5.182.717.717 0 0 1-.242 1.228A29.973 29.973 0 0 0 10.4 12a.717.717 0 0 1-.802 0 30.118 30.118 0 0 0-1.987-1.23V9.645c0-.233.11-.442.288-.566a33.926 33.926 0 0 1 3.158-1.942.716.716 0 0 0-.682-1.26 35.349 35.349 0 0 0-3.293 2.025 2.117 2.117 0 0 0-.905 1.742v.363A29.902 29.902 0 0 0 2.09 8.34a.717.717 0 0 1-.242-1.228A39.228 39.228 0 0 1 9.679 1.93v.001Zm-3.5 9.688a28.53 28.53 0 0 0-2.346-1.106 39.2 39.2 0 0 0-.373 2.975.716.716 0 0 0 .4.707c.505.244 1 .506 1.485.783-.2.31-.434.602-.706.873a.716.716 0 1 0 1.013 1.013 6.7 6.7 0 0 0 .917-1.14 25.423 25.423 0 0 1 2.957 2.244.717.717 0 0 0 .948 0 25.36 25.36 0 0 1 5.665-3.774.717.717 0 0 0 .402-.706 39.293 39.293 0 0 0-.373-2.975 28.596 28.596 0 0 0-4.967 2.676 2.15 2.15 0 0 1-2.402 0c-.392-.263-.79-.517-1.194-.762a6.677 6.677 0 0 1-1.036 3.297c-.4-.26-.809-.51-1.224-.746a5.242 5.242 0 0 0 .833-2.842v-.517Z",
          clipRule: "evenodd"
        }
      )
    );
  }
);
AcademicCapSolid.displayName = "AcademicCapSolid";

export { AcademicCapSolid as default };
//# sourceMappingURL=academic-cap-solid.js.map
