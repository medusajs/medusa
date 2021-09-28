"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDifference = getDifference;

var _lodash = require("lodash");

function getDifference(obj1, obj2) {
  var diff = Object.keys(obj1).reduce(function (result, key) {
    if (check(obj1, obj2, key)) {
      var resultKeyIndex = result.indexOf(key);
      result.splice(resultKeyIndex, 1);
    }

    return result;
  }, Object.keys(obj2));
  return diff;
}

function check(obj1, obj2, key) {
  var bannedKeys = ["id", "updated_at", "created_at", "deleted_at"];
  return (0, _lodash.isEqual)(obj1[key], obj2[key]) || bannedKeys.includes(key) || obj1[key] === null && obj2[key] === null;
}