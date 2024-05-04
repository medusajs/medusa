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
const FolderIllustration = React.forwardRef(
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
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: "#60A5FA",
          fillRule: "evenodd",
          d: "M18.25 14.722a2.972 2.972 0 0 1-2.972 2.972H4.722a2.972 2.972 0 0 1-2.972-2.972V5.278a2.972 2.972 0 0 1 2.972-2.973H6.89c.902 0 1.754.41 2.318 1.112l.445.555h5.625a2.972 2.972 0 0 1 2.972 2.972v7.778Z",
          clipRule: "evenodd"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: "url(#a)",
          fillOpacity: 0.15,
          fillRule: "evenodd",
          d: "M18.25 14.722a2.972 2.972 0 0 1-2.972 2.972H4.722a2.972 2.972 0 0 1-2.972-2.972V5.278a2.972 2.972 0 0 1 2.972-2.973H6.89c.902 0 1.754.41 2.318 1.112l.445.555h5.625a2.972 2.972 0 0 1 2.972 2.972v7.778Z",
          clipRule: "evenodd"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          stroke: "#000",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeOpacity: 0.15,
          strokeWidth: 0.5,
          d: "M9.458 4.128a.25.25 0 0 0 .195.094h5.625A2.722 2.722 0 0 1 18 6.944v7.778a2.722 2.722 0 0 1-2.722 2.722H4.722A2.722 2.722 0 0 1 2 14.722V5.278a2.722 2.722 0 0 1 2.722-2.723H6.89c.826 0 1.606.375 2.123 1.018l.445.555Z"
        }
      ),
      /* @__PURE__ */ React.createElement("g", { filter: "url(#b)" }, /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: "#60A5FA",
          d: "M1.75 9.722A2.972 2.972 0 0 1 4.722 6.75h10.556a2.972 2.972 0 0 1 2.972 2.972v5a2.972 2.972 0 0 1-2.972 2.972H4.722a2.972 2.972 0 0 1-2.972-2.972v-5Z"
        }
      ), /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: "url(#c)",
          fillOpacity: 0.2,
          d: "M1.75 9.722A2.972 2.972 0 0 1 4.722 6.75h10.556a2.972 2.972 0 0 1 2.972 2.972v5a2.972 2.972 0 0 1-2.972 2.972H4.722a2.972 2.972 0 0 1-2.972-2.972v-5Z"
        }
      )),
      /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement(
        "linearGradient",
        {
          id: "a",
          x1: 10,
          x2: 10,
          y1: 2.305,
          y2: 17.694,
          gradientUnits: "userSpaceOnUse"
        },
        /* @__PURE__ */ React.createElement("stop", null),
        /* @__PURE__ */ React.createElement("stop", { offset: 1, stopOpacity: 0 })
      ), /* @__PURE__ */ React.createElement(
        "linearGradient",
        {
          id: "c",
          x1: 10,
          x2: 10,
          y1: 6.75,
          y2: 17.694,
          gradientUnits: "userSpaceOnUse"
        },
        /* @__PURE__ */ React.createElement("stop", { stopColor: "#fff" }),
        /* @__PURE__ */ React.createElement("stop", { offset: 1, stopColor: "#fff", stopOpacity: 0 })
      ), /* @__PURE__ */ React.createElement(
        "filter",
        {
          id: "b",
          width: 16.5,
          height: 10.944,
          x: 1.75,
          y: 6.75,
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
        /* @__PURE__ */ React.createElement("feOffset", { dy: -0.5 }),
        /* @__PURE__ */ React.createElement("feComposite", { in2: "hardAlpha", k2: -1, k3: 1, operator: "arithmetic" }),
        /* @__PURE__ */ React.createElement("feColorMatrix", { values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" }),
        /* @__PURE__ */ React.createElement("feBlend", { in2: "shape", result: "effect1_innerShadow_6347_11987" }),
        /* @__PURE__ */ React.createElement(
          "feColorMatrix",
          {
            in: "SourceAlpha",
            result: "hardAlpha",
            values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          }
        ),
        /* @__PURE__ */ React.createElement("feOffset", { dy: 0.5 }),
        /* @__PURE__ */ React.createElement("feComposite", { in2: "hardAlpha", k2: -1, k3: 1, operator: "arithmetic" }),
        /* @__PURE__ */ React.createElement("feColorMatrix", { values: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0" }),
        /* @__PURE__ */ React.createElement(
          "feBlend",
          {
            in2: "effect1_innerShadow_6347_11987",
            result: "effect2_innerShadow_6347_11987"
          }
        )
      ))
    );
  }
);
FolderIllustration.displayName = "FolderIllustration";

export { FolderIllustration as default };
//# sourceMappingURL=folder-illustration.js.map
