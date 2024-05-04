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
const ThumbnailBadge = React.forwardRef(
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
      /* @__PURE__ */ React.createElement("g", { clipPath: "url(#a)" }, /* @__PURE__ */ React.createElement("g", { filter: "url(#b)" }, /* @__PURE__ */ React.createElement("circle", { cx: 10, cy: 10, r: 9, fill: "#3B82F6" }), /* @__PURE__ */ React.createElement("circle", { cx: 10, cy: 10, r: 9, fill: "url(#c)", fillOpacity: 0.2 }), /* @__PURE__ */ React.createElement(
        "circle",
        {
          cx: 10,
          cy: 10,
          r: 8.75,
          stroke: "#000",
          strokeOpacity: 0.2,
          strokeWidth: 0.5
        }
      )), /* @__PURE__ */ React.createElement("g", { fill: "#fff", clipPath: "url(#d)" }, /* @__PURE__ */ React.createElement("path", { d: "M5.5 12.87a.835.835 0 0 1-.833-.833V7.963a.835.835 0 0 1 1.096-.791l.562.187a.5.5 0 0 1-.317.949l-.342-.114v3.613l.342-.114a.5.5 0 1 1 .317.948l-.562.188a.826.826 0 0 1-.262.042ZM8.167 14.167a.834.834 0 0 1-.833-.834V6.667a.832.832 0 0 1 1.153-.77l.539.224a.5.5 0 0 1-.385.924l-.307-.128v6.166l.307-.128a.5.5 0 0 1 .385.924l-.539.224a.843.843 0 0 1-.32.064ZM14.655 6.367l-3.472-1.603A.833.833 0 0 0 10 5.52v8.958a.83.83 0 0 0 .833.834.84.84 0 0 0 .35-.077l3.472-1.603a1.17 1.17 0 0 0 .678-1.06V7.428c0-.454-.266-.87-.678-1.06Z" }))),
      /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("clipPath", { id: "a" }, /* @__PURE__ */ React.createElement("path", { fill: "#fff", d: "M0 0h20v20H0z" })), /* @__PURE__ */ React.createElement("clipPath", { id: "d" }, /* @__PURE__ */ React.createElement("path", { fill: "#fff", d: "M4 4h12v12H4z" })), /* @__PURE__ */ React.createElement(
        "linearGradient",
        {
          id: "c",
          x1: 10,
          x2: 10,
          y1: 1,
          y2: 19,
          gradientUnits: "userSpaceOnUse"
        },
        /* @__PURE__ */ React.createElement("stop", { stopColor: "#fff" }),
        /* @__PURE__ */ React.createElement("stop", { offset: 1, stopColor: "#fff", stopOpacity: 0 })
      ), /* @__PURE__ */ React.createElement(
        "filter",
        {
          id: "b",
          width: 22.215,
          height: 22.215,
          x: -1.108,
          y: -0.054,
          colorInterpolationFilters: "sRGB",
          filterUnits: "userSpaceOnUse"
        },
        /* @__PURE__ */ React.createElement("feFlood", { floodOpacity: 0, result: "BackgroundImageFix" }),
        /* @__PURE__ */ React.createElement(
          "feColorMatrix",
          {
            in: "SourceAlpha",
            result: "hardAlpha",
            values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          }
        ),
        /* @__PURE__ */ React.createElement("feOffset", { dy: 1.054 }),
        /* @__PURE__ */ React.createElement("feGaussianBlur", { stdDeviation: 1.054 }),
        /* @__PURE__ */ React.createElement("feComposite", { in2: "hardAlpha", operator: "out" }),
        /* @__PURE__ */ React.createElement("feColorMatrix", { values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" }),
        /* @__PURE__ */ React.createElement(
          "feBlend",
          {
            in2: "BackgroundImageFix",
            result: "effect1_dropShadow_6384_214"
          }
        ),
        /* @__PURE__ */ React.createElement(
          "feBlend",
          {
            in: "SourceGraphic",
            in2: "effect1_dropShadow_6384_214",
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
        /* @__PURE__ */ React.createElement("feOffset", { dy: 1.054 }),
        /* @__PURE__ */ React.createElement("feGaussianBlur", { stdDeviation: 1.054 }),
        /* @__PURE__ */ React.createElement("feComposite", { in2: "hardAlpha", k2: -1, k3: 1, operator: "arithmetic" }),
        /* @__PURE__ */ React.createElement("feColorMatrix", { values: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0" }),
        /* @__PURE__ */ React.createElement("feBlend", { in2: "shape", result: "effect2_innerShadow_6384_214" }),
        /* @__PURE__ */ React.createElement(
          "feColorMatrix",
          {
            in: "SourceAlpha",
            result: "hardAlpha",
            values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          }
        ),
        /* @__PURE__ */ React.createElement("feOffset", { dy: -1.054 }),
        /* @__PURE__ */ React.createElement("feGaussianBlur", { stdDeviation: 2.635 }),
        /* @__PURE__ */ React.createElement("feComposite", { in2: "hardAlpha", k2: -1, k3: 1, operator: "arithmetic" }),
        /* @__PURE__ */ React.createElement("feColorMatrix", { values: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0" }),
        /* @__PURE__ */ React.createElement(
          "feBlend",
          {
            in2: "effect2_innerShadow_6384_214",
            result: "effect3_innerShadow_6384_214"
          }
        )
      ))
    );
  }
);
ThumbnailBadge.displayName = "ThumbnailBadge";

export { ThumbnailBadge as default };
//# sourceMappingURL=thumbnail-badge.js.map
