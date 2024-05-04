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
const GatsbyEx = React.forwardRef(
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
          d: "M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-16.072.129c0 1.735.708 3.535 2.058 4.885 1.35 1.35 3.15 1.993 4.95 2.057L2.928 10.13Zm.193-1.672 8.422 8.422c3.15-.708 5.528-3.536 5.528-6.879h-4.5v1.286h3.086c-.45 1.928-1.864 3.535-3.729 4.178L4.536 8.071C5.37 5.821 7.493 4.214 10 4.214c1.928 0 3.664.965 4.757 2.443l.964-.836C14.436 4.086 12.38 2.93 10 2.93c-3.343 0-6.172 2.378-6.879 5.528Z",
          clipRule: "evenodd"
        }
      )
    );
  }
);
GatsbyEx.displayName = "GatsbyEx";

export { GatsbyEx as default };
//# sourceMappingURL=gatsby-ex.js.map
