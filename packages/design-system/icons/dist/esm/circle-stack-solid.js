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
const CircleStackSolid = React.forwardRef(
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
          d: "M17.5 5.313c0 2.243-3.358 4.062-7.5 4.062-4.142 0-7.5-1.82-7.5-4.063C2.5 3.07 5.858 1.25 10 1.25c4.142 0 7.5 1.82 7.5 4.063Z"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: color,
          d: "M10 10.625c2.238 0 4.325-.488 5.898-1.34A6.901 6.901 0 0 0 17.48 8.13c.014.1.021.203.021.307 0 2.243-3.358 4.062-7.5 4.062-4.142 0-7.5-1.82-7.5-4.062 0-.104.007-.206.02-.307.47.457 1.003.846 1.582 1.153 1.572.853 3.66 1.341 5.898 1.341Z"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: color,
          d: "M10 13.75c2.238 0 4.325-.488 5.898-1.34a6.903 6.903 0 0 0 1.581-1.154c.014.1.021.203.021.306 0 2.244-3.358 4.063-7.5 4.063-4.142 0-7.5-1.82-7.5-4.063 0-.103.007-.205.02-.306.47.457 1.003.846 1.582 1.153 1.572.853 3.66 1.341 5.898 1.341Z"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: color,
          d: "M10 16.875c2.238 0 4.325-.488 5.898-1.34a6.903 6.903 0 0 0 1.581-1.154c.014.1.021.203.021.306 0 2.244-3.358 4.063-7.5 4.063-4.142 0-7.5-1.82-7.5-4.063 0-.103.007-.205.02-.306.47.457 1.003.846 1.582 1.153 1.572.853 3.66 1.341 5.898 1.341Z"
        }
      )
    );
  }
);
CircleStackSolid.displayName = "CircleStackSolid";

export { CircleStackSolid as default };
//# sourceMappingURL=circle-stack-solid.js.map
