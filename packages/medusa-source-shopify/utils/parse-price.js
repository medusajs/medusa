"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parsePrice = parsePrice;

function parsePrice(price) {
  return parseInt(Number(price).toFixed(2) * 100);
}