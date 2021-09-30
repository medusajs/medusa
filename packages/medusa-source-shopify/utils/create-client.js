"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createClient = void 0;

var _shopifyApi = _interopRequireDefault(require("@shopify/shopify-api"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var createClient = function createClient(options) {
  var domain = options.domain,
      password = options.password;
  return new _shopifyApi["default"].Clients.Rest("".concat(domain, ".myshopify.com"), password);
};

exports.createClient = createClient;