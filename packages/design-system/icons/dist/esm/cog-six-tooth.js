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
const CogSixTooth = React.forwardRef(
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
          d: "M7.995 3.283A.938.938 0 0 1 8.92 2.5h2.16c.46 0 .85.332.926.783l.177 1.068c.053.311.261.572.538.725.062.033.122.069.183.106.27.163.6.214.896.103l1.014-.38a.937.937 0 0 1 1.142.408l1.08 1.873a.937.937 0 0 1-.217 1.192l-.836.69c-.244.2-.365.51-.359.826.002.071.002.142 0 .213-.006.315.115.625.359.825l.837.69a.938.938 0 0 1 .217 1.191l-1.082 1.873a.938.938 0 0 1-1.14.409l-1.015-.38a1.039 1.039 0 0 0-.897.103c-.06.037-.121.073-.183.107a1.04 1.04 0 0 0-.537.724l-.177 1.067a.938.938 0 0 1-.925.784H8.919a.938.938 0 0 1-.925-.783l-.177-1.068a1.037 1.037 0 0 0-.537-.725 5.398 5.398 0 0 1-.183-.106c-.271-.163-.6-.214-.897-.103l-1.014.38a.938.938 0 0 1-1.14-.408l-1.082-1.873a.938.938 0 0 1 .217-1.192l.837-.69c.243-.2.364-.51.358-.826a5.788 5.788 0 0 1 0-.213 1.034 1.034 0 0 0-.358-.825l-.837-.69a.938.938 0 0 1-.217-1.191l1.081-1.873a.938.938 0 0 1 1.142-.409l1.013.38c.297.11.626.06.897-.103.06-.037.121-.073.183-.107.277-.152.485-.413.537-.724l.178-1.068v0Z"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          stroke: color,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 1.5,
          d: "M12.5 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0v0Z"
        }
      )
    );
  }
);
CogSixTooth.displayName = "CogSixTooth";

export { CogSixTooth as default };
//# sourceMappingURL=cog-six-tooth.js.map
