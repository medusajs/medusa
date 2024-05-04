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
const VerifiedBadge = React.forwardRef(
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
      /* @__PURE__ */ React.createElement("g", { clipPath: "url(#a)" }, /* @__PURE__ */ React.createElement("g", { filter: "url(#b)" }, /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: "#3B82F6",
          fillRule: "evenodd",
          d: "M6.864 2.43A4.145 4.145 0 0 1 10 1a4.14 4.14 0 0 1 3.136 1.43 4.145 4.145 0 0 1 3.229 1.206 4.147 4.147 0 0 1 1.206 3.228A4.146 4.146 0 0 1 19 10a4.143 4.143 0 0 1-1.43 3.136 4.146 4.146 0 0 1-1.206 3.228 4.145 4.145 0 0 1-3.228 1.206A4.144 4.144 0 0 1 10 19a4.143 4.143 0 0 1-3.136-1.43 4.145 4.145 0 0 1-3.229-1.205 4.145 4.145 0 0 1-1.206-3.23A4.145 4.145 0 0 1 1 10a4.14 4.14 0 0 1 1.43-3.136 4.145 4.145 0 0 1 1.206-3.228A4.145 4.145 0 0 1 6.864 2.43Z",
          clipRule: "evenodd"
        }
      ), /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: "url(#c)",
          fillOpacity: 0.2,
          fillRule: "evenodd",
          d: "M6.864 2.43A4.145 4.145 0 0 1 10 1a4.14 4.14 0 0 1 3.136 1.43 4.145 4.145 0 0 1 3.229 1.206 4.147 4.147 0 0 1 1.206 3.228A4.146 4.146 0 0 1 19 10a4.143 4.143 0 0 1-1.43 3.136 4.146 4.146 0 0 1-1.206 3.228 4.145 4.145 0 0 1-3.228 1.206A4.144 4.144 0 0 1 10 19a4.143 4.143 0 0 1-3.136-1.43 4.145 4.145 0 0 1-3.229-1.205 4.145 4.145 0 0 1-1.206-3.23A4.145 4.145 0 0 1 1 10a4.14 4.14 0 0 1 1.43-3.136 4.145 4.145 0 0 1 1.206-3.228A4.145 4.145 0 0 1 6.864 2.43Z",
          clipRule: "evenodd"
        }
      ), /* @__PURE__ */ React.createElement(
        "path",
        {
          stroke: "#000",
          strokeOpacity: 0.2,
          strokeWidth: 0.5,
          d: "m6.847 2.68.124.008.082-.094A3.895 3.895 0 0 1 10 1.25a3.89 3.89 0 0 1 2.947 1.344l.082.094.124-.009a3.894 3.894 0 0 1 3.035 1.134 3.895 3.895 0 0 1 1.134 3.034l-.01.124.095.082A3.896 3.896 0 0 1 18.75 10a3.896 3.896 0 0 1-1.344 2.947l-.094.082.009.124a3.896 3.896 0 0 1-1.134 3.034 3.899 3.899 0 0 1-3.034 1.134l-.124-.01-.082.095A3.896 3.896 0 0 1 10 18.75a3.896 3.896 0 0 1-2.947-1.344l-.082-.094-.125.009a3.894 3.894 0 0 1-3.034-1.133 3.897 3.897 0 0 1-1.134-3.034l.01-.125-.095-.082A3.895 3.895 0 0 1 1.25 10a3.89 3.89 0 0 1 1.344-2.947l.094-.082-.009-.124a3.895 3.895 0 0 1 1.134-3.034 3.894 3.894 0 0 1 3.034-1.134Z"
        }
      )), /* @__PURE__ */ React.createElement(
        "path",
        {
          stroke: "#fff",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 1.5,
          d: "M6.667 10.333 9.333 13l4-6"
        }
      )),
      /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement(
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
      ), /* @__PURE__ */ React.createElement("clipPath", { id: "a" }, /* @__PURE__ */ React.createElement("path", { fill: "#fff", d: "M0 0h20v20H0z" })), /* @__PURE__ */ React.createElement(
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
            result: "effect1_dropShadow_6386_370"
          }
        ),
        /* @__PURE__ */ React.createElement(
          "feBlend",
          {
            in: "SourceGraphic",
            in2: "effect1_dropShadow_6386_370",
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
        /* @__PURE__ */ React.createElement("feBlend", { in2: "shape", result: "effect2_innerShadow_6386_370" }),
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
            in2: "effect2_innerShadow_6386_370",
            result: "effect3_innerShadow_6386_370"
          }
        )
      ))
    );
  }
);
VerifiedBadge.displayName = "VerifiedBadge";

export { VerifiedBadge as default };
//# sourceMappingURL=verified-badge.js.map
