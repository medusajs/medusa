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
const UserGroup = React.forwardRef(
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
          d: "M14.216 12.934a2.5 2.5 0 0 1 3.902 2.267c-1 .35-2.062.485-3.118.399a4.996 4.996 0 0 0-5-4.975 4.996 4.996 0 0 0-4.215 2.31m9.214 2.664.001.026c0 .188-.01.373-.03.555A9.953 9.953 0 0 1 10 17.5a9.952 9.952 0 0 1-4.97-1.32A5.052 5.052 0 0 1 5 15.6m0 0a7.484 7.484 0 0 1-3.116-.398 2.5 2.5 0 0 1 3.901-2.267M5 15.599a4.977 4.977 0 0 1 .785-2.664m6.715-7.31a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm5 2.5a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm-11.25 0a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Z"
        }
      )
    );
  }
);
UserGroup.displayName = "UserGroup";

export { UserGroup as default };
//# sourceMappingURL=user-group.js.map
