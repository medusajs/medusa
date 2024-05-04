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
const ChatBubble = React.forwardRef(
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
          d: "M7.188 8.125h-.313m3.438 0H10m3.438 0h-.313m-5.938 0a.312.312 0 1 1-.624 0 .312.312 0 0 1 .625 0v0Zm3.125 0a.312.312 0 1 1-.624 0 .312.312 0 0 1 .624 0v0Zm3.126 0a.312.312 0 1 1-.625 0 .312.312 0 0 1 .624 0v0ZM1.874 10.633c0 1.334.936 2.495 2.256 2.69.906.133 1.82.235 2.744.307v3.87l3.487-3.486a.95.95 0 0 1 .648-.276 40.242 40.242 0 0 0 4.858-.415c1.321-.195 2.257-1.356 2.257-2.69V5.618c0-1.336-.936-2.496-2.256-2.69A40.329 40.329 0 0 0 10 2.5c-1.993 0-3.953.146-5.87.428-1.32.194-2.255 1.355-2.255 2.69V10.633Z"
        }
      )
    );
  }
);
ChatBubble.displayName = "ChatBubble";

export { ChatBubble as default };
//# sourceMappingURL=chat-bubble.js.map
