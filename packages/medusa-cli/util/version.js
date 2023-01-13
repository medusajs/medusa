"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocalMedusaVersion = void 0;

var _medusaCoreUtils = require("medusa-core-utils");

var getLocalMedusaVersion = function getLocalMedusaVersion() {
  var version = (0, _medusaCoreUtils.getMedusaVersion)();
  return version;
};

exports.getLocalMedusaVersion = getLocalMedusaVersion;