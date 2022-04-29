"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = exports.getProductsProduct = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Retrieves a Product.
 * @summary Retrieves a Product
 */
var getProductsProduct = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/products/".concat(id),
        method: "get",
    });
};
exports.getProductsProduct = getProductsProduct;
/**
 * Retrieves a list of Products.
 * @summary List Products
 */
var getProducts = function (params) {
    return (0, custom_instance_1.getClient)({ url: "/products", method: "get", params: params });
};
exports.getProducts = getProducts;
//# sourceMappingURL=product.js.map