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
const ChatBubbleLeftRightSolid = React.forwardRef(
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
          d: "M4.094 2.215a41.058 41.058 0 0 1 10.562 0c1.602.208 2.742 1.55 2.837 3.106a3.67 3.67 0 0 0-.86-.176 42.408 42.408 0 0 0-7.016 0C7.652 5.308 6.25 6.97 6.25 8.84v3.572a3.725 3.725 0 0 0 2.027 3.32l-2.21 2.21A.625.625 0 0 1 5 17.5v-3.358a40.495 40.495 0 0 1-.906-.107c-1.673-.218-2.844-1.674-2.844-3.317V5.532c0-1.642 1.17-3.1 2.844-3.317Z"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fill: color,
          d: "M13.125 6.25c-1.147 0-2.283.048-3.405.14-1.283.107-2.22 1.196-2.22 2.45v3.572c0 1.255.94 2.345 2.225 2.45 1.036.085 2.083.13 3.14.137l2.318 2.318a.625.625 0 0 0 1.067-.442v-1.992l.275-.021c1.285-.104 2.225-1.194 2.225-2.45V8.84c0-1.254-.938-2.343-2.22-2.45a41.163 41.163 0 0 0-3.405-.14Z"
        }
      )
    );
  }
);
ChatBubbleLeftRightSolid.displayName = "ChatBubbleLeftRightSolid";

export { ChatBubbleLeftRightSolid as default };
//# sourceMappingURL=chat-bubble-left-right-solid.js.map
