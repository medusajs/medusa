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
const ChatBubbleLeftRight = React.forwardRef(
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
          d: "M16.875 7.093c.737.236 1.25.94 1.25 1.747v3.572c0 .946-.706 1.75-1.65 1.827-.283.023-.567.043-.85.06v2.576l-2.5-2.5a41.25 41.25 0 0 1-3.35-.136 1.763 1.763 0 0 1-.688-.202m7.788-6.945a1.772 1.772 0 0 0-.397-.079 40.532 40.532 0 0 0-6.706 0c-.943.079-1.647.881-1.647 1.827v3.572c0 .697.383 1.316.963 1.625m7.787-6.945V5.532c0-1.351-.96-2.522-2.3-2.696a40.378 40.378 0 0 0-10.4 0c-1.34.174-2.3 1.345-2.3 2.696v5.188c0 1.351.96 2.522 2.3 2.696.48.063.964.117 1.45.162V17.5l3.463-3.463"
        }
      )
    );
  }
);
ChatBubbleLeftRight.displayName = "ChatBubbleLeftRight";

export { ChatBubbleLeftRight as default };
//# sourceMappingURL=chat-bubble-left-right.js.map
