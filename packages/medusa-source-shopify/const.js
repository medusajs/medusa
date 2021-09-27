"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WEBHOOKS = exports.SHOPIFY_SCOPES = exports.HOST = void 0;

var _shopifyApi = require("@shopify/shopify-api");

var HOST = "https://339b-83-151-141-70.ngrok.io/shopify";
exports.HOST = HOST;
var SHOPIFY_SCOPES = ["read_products", "read_orders", "write_orders"];
exports.SHOPIFY_SCOPES = SHOPIFY_SCOPES;
var WEBHOOKS = [{
  path: "webhooks",
  body: {
    webhook: {
      topic: "orders/create",
      address: "".concat(HOST, "/order/create"),
      format: "json"
    }
  },
  type: _shopifyApi.DataType.JSON
}, {
  path: "webhooks",
  body: {
    webhook: {
      topic: "orders/delete",
      address: "".concat(HOST, "/order/delete"),
      format: "json"
    }
  },
  type: _shopifyApi.DataType.JSON
}, {
  path: "webhooks",
  body: {
    webhook: {
      topic: "orders/fulfillment",
      address: "".concat(HOST, "/order/fulfillment"),
      format: "json"
    }
  },
  type: _shopifyApi.DataType.JSON
}, {
  path: "webhooks",
  body: {
    webhook: {
      topic: "orders/payment",
      address: "".concat(HOST, "/order/payment"),
      format: "json"
    }
  },
  type: _shopifyApi.DataType.JSON
}];
exports.WEBHOOKS = WEBHOOKS;