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
const TrianglesMini = React.forwardRef(
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
          d: "M7.41 8.25c-.163 0-.323-.037-.464-.108a.848.848 0 0 1-.334-.293.68.68 0 0 1-.112-.397.693.693 0 0 1 .142-.39l2.59-3.454c.082-.11.195-.2.33-.263a1.04 1.04 0 0 1 .876 0 .868.868 0 0 1 .33.263l2.59 3.455a.693.693 0 0 1 .141.39.68.68 0 0 1-.111.396.85.85 0 0 1-.335.293c-.14.07-.3.108-.464.108H7.41ZM12.59 11.75c.163 0 .323.037.463.108.14.07.256.172.335.293a.68.68 0 0 1 .111.397.692.692 0 0 1-.141.39l-2.59 3.454a.867.867 0 0 1-.33.263 1.04 1.04 0 0 1-.876 0 .867.867 0 0 1-.33-.263l-2.59-3.455a.693.693 0 0 1-.142-.39.68.68 0 0 1 .112-.396.849.849 0 0 1 .335-.293c.14-.07.3-.108.463-.108h5.18Z"
        }
      )
    );
  }
);
TrianglesMini.displayName = "TrianglesMini";

export { TrianglesMini as default };
//# sourceMappingURL=triangles-mini.js.map
