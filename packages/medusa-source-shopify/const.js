"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.INCLUDE_PRESENTMENT_PRICES = exports.SHOPIFY_SCOPES = exports.HOST = void 0;
var HOST = "https://339b-83-151-141-70.ngrok.io/shopify";
exports.HOST = HOST;
var SHOPIFY_SCOPES = ["read_products", "read_orders", "write_orders"];
exports.SHOPIFY_SCOPES = SHOPIFY_SCOPES;
var INCLUDE_PRESENTMENT_PRICES = {
  "X-Shopify-Api-Features": "include-presentment-prices"
};
exports.INCLUDE_PRESENTMENT_PRICES = INCLUDE_PRESENTMENT_PRICES;