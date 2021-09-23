"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeIndex = removeIndex;

function removeIndex(arr, obj) {
  var index = arr.indexOf(obj);
  arr.splice(index, 1);
}