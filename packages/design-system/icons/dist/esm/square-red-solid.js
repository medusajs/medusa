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
const SquareRedSolid = React.forwardRef(
  (_a, ref) => {
    var _b = _a, props = __objRest(_b, ["color"]);
    return /* @__PURE__ */ React.createElement(
      "svg",
      __spreadValues({
        xmlns: "http://www.w3.org/2000/svg",
        width: 20,
        height: 20,
        fill: "none",
        ref
      }, props),
      /* @__PURE__ */ React.createElement("g", { filter: "url(#a)" }, /* @__PURE__ */ React.createElement("rect", { width: 8, height: 8, x: 6, y: 6, fill: "#E11D48", rx: 2 })),
      /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement(
        "filter",
        {
          id: "a",
          width: 8,
          height: 8,
          x: 6,
          y: 6,
          colorInterpolationFilters: "sRGB",
          filterUnits: "userSpaceOnUse"
        },
        /* @__PURE__ */ React.createElement("feFlood", { floodOpacity: 0, result: "BackgroundImageFix" }),
        /* @__PURE__ */ React.createElement(
          "feBlend",
          {
            in: "SourceGraphic",
            in2: "BackgroundImageFix",
            result: "shape"
          }
        ),
        /* @__PURE__ */ React.createElement(
          "feColorMatrix",
          {
            in: "SourceAlpha",
            result: "hardAlpha",
            values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          }
        ),
        /* @__PURE__ */ React.createElement(
          "feMorphology",
          {
            in: "SourceAlpha",
            radius: 1,
            result: "effect1_innerShadow_6166_955"
          }
        ),
        /* @__PURE__ */ React.createElement("feOffset", null),
        /* @__PURE__ */ React.createElement("feComposite", { in2: "hardAlpha", k2: -1, k3: 1, operator: "arithmetic" }),
        /* @__PURE__ */ React.createElement("feColorMatrix", { values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" }),
        /* @__PURE__ */ React.createElement("feBlend", { in2: "shape", result: "effect1_innerShadow_6166_955" })
      ))
    );
  }
);
SquareRedSolid.displayName = "SquareRedSolid";

export { SquareRedSolid as default };
//# sourceMappingURL=square-red-solid.js.map
