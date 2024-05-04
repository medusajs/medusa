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
const SparklesSolid = React.forwardRef(
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
          d: "M7.5 3.75a.625.625 0 0 1 .6.453l.678 2.372a3.125 3.125 0 0 0 2.147 2.147l2.372.677a.625.625 0 0 1 0 1.202l-2.372.677a3.125 3.125 0 0 0-2.147 2.147l-.677 2.372a.625.625 0 0 1-1.202 0l-.677-2.372a3.125 3.125 0 0 0-2.147-2.147l-2.372-.677a.624.624 0 0 1 0-1.202l2.372-.677a3.125 3.125 0 0 0 2.147-2.147l.677-2.372A.625.625 0 0 1 7.5 3.75Zm7.5-2.5a.625.625 0 0 1 .607.473l.215.864a2.191 2.191 0 0 0 1.591 1.591l.864.215a.625.625 0 0 1 0 1.214l-.864.215a2.191 2.191 0 0 0-1.591 1.591l-.215.864a.625.625 0 0 1-1.214 0l-.215-.864a2.187 2.187 0 0 0-1.591-1.591l-.864-.215a.625.625 0 0 1 0-1.214l.864-.215a2.187 2.187 0 0 0 1.591-1.591l.215-.864A.626.626 0 0 1 15 1.25ZM13.75 12.5a.625.625 0 0 1 .593.428l.329.985c.125.373.416.666.79.79l.986.33a.626.626 0 0 1 0 1.185l-.986.329a1.25 1.25 0 0 0-.79.79l-.33.986a.625.625 0 0 1-1.184 0l-.33-.986a1.25 1.25 0 0 0-.79-.79l-.986-.33a.625.625 0 0 1 0-1.184l.986-.33a1.25 1.25 0 0 0 .79-.79l.33-.986a.624.624 0 0 1 .592-.427Z",
          clipRule: "evenodd"
        }
      )
    );
  }
);
SparklesSolid.displayName = "SparklesSolid";

export { SparklesSolid as default };
//# sourceMappingURL=sparkles-solid.js.map
