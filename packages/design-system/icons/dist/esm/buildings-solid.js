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
const BuildingsSolid = React.forwardRef(
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
          d: "M13.893 4.154v3.121h2.347A1.524 1.524 0 0 1 17.764 8.8v6.992h.024a.75.75 0 0 1 0 1.5H2.303a.75.75 0 0 1 0-1.5h.024V4.154A1.524 1.524 0 0 1 3.852 2.63h8.516a1.524 1.524 0 0 1 1.525 1.524Zm-3.654 11.732a.65.65 0 0 1-.65-.65V13.86H6.631v1.377a.65.65 0 1 1-1.3 0V13.21a.65.65 0 0 1 .65-.65h4.258a.65.65 0 0 1 .65.65v2.027a.65.65 0 0 1-.65.65ZM5.981 9.211a.75.75 0 1 0 0 1.5h4.258a.75.75 0 1 0 0-1.5H5.981Zm9.48 6.673a.75.75 0 0 1-.75-.75V9.961a.75.75 0 0 1 1.5 0v5.173a.75.75 0 0 1-.75.75Zm-9.48-9.982a.75.75 0 0 0 0 1.5h4.258a.75.75 0 0 0 0-1.5H5.981Z",
          clipRule: "evenodd"
        }
      )
    );
  }
);
BuildingsSolid.displayName = "BuildingsSolid";

export { BuildingsSolid as default };
//# sourceMappingURL=buildings-solid.js.map
