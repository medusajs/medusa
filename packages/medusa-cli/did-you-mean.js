"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.didYouMean = didYouMean;

var _meant = _interopRequireDefault(require("meant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function didYouMean(scmd, commands) {
  var bestSimilarity = (0, _meant["default"])(scmd, commands).map(function (str) {
    return "    ".concat(str);
  });
  if (bestSimilarity.length === 0) return "";

  if (bestSimilarity.length === 1) {
    return "\nDid you mean this?\n ".concat(bestSimilarity[0], "\n");
  } else {
    return ["\nDid you mean one of these?"].concat(bestSimilarity.slice(0, 3)).join("\n") + "\n";
  }
}