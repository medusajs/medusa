"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformProduct = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var variantKeys = ["sku", "title", "upc", "ean", "mid_code", "hs_code", "options"];
var prefix = "variant";

var transformProduct = function transformProduct(product) {
  var initialObj = variantKeys.reduce(function (obj, key) {
    obj["".concat(prefix, "_").concat(key)] = [];
    return obj;
  }, {});
  initialObj["".concat(prefix, "_options_value")] = [];
  var flattenedVariantFields = product.variants.reduce(function (obj, variant) {
    variantKeys.forEach(function (k) {
      if (k === "options" && variant[k]) {
        var values = variant[k].map(function (option) {
          return option.value;
        });
        obj["".concat(prefix, "_options_value")] = obj["".concat(prefix, "_options_value")].concat(values);
        return;
      }

      return variant[k] && obj["".concat(prefix, "_").concat(k)].push(variant[k]);
    });
    return obj;
  }, initialObj);
  product.type_value = product.type && product.type.value;
  product.collection_title = product.collection && product.collection.title;
  product.collection_handle = product.collection && product.collection.handle;
  product.tags_value = product.tags ? product.tags.map(function (t) {
    return t.value;
  }) : [];
  return _objectSpread(_objectSpread({}, product), flattenedVariantFields);
};

exports.transformProduct = transformProduct;