"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postProductsProductMetadata = exports.getProductsTypes = exports.postProductsProductVariantsVariant = exports.deleteProductsProductVariantsVariant = exports.postProductsProduct = exports.getProductsProduct = exports.deleteProductsProduct = exports.postProductsProductOptionsOption = exports.deleteProductsProductOptionsOption = exports.getProductsProductVariants = exports.postProductsProductVariants = exports.getProducts = exports.postProducts = exports.postProductsProductOptions = exports.getPriceListsPriceListProducts = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Retrieves a list of Product that are part of a Price List
 * @summary List Product in a Price List
 */
var getPriceListsPriceListProducts = function (params) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/price-lists/:id/products",
        method: "get",
        params: params,
    });
};
exports.getPriceListsPriceListProducts = getPriceListsPriceListProducts;
/**
 * Adds a Product Option to a Product
 * @summary Add an Option
 */
var postProductsProductOptions = function (id, postProductsProductOptionsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/products/".concat(id, "/options"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postProductsProductOptionsBody,
    });
};
exports.postProductsProductOptions = postProductsProductOptions;
/**
 * Creates a Product
 * @summary Create a Product
 */
var postProducts = function (postProductsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/products",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postProductsBody,
    });
};
exports.postProducts = postProducts;
/**
 * Retrieves a list of Product
 * @summary List Product
 */
var getProducts = function (params) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/products",
        method: "get",
        params: params,
    });
};
exports.getProducts = getProducts;
/**
 * Creates a Product Variant. Each Product Variant must have a unique combination of Product Option Values.
 * @summary Create a Product Variant
 */
var postProductsProductVariants = function (id, postProductsProductVariantsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/products/".concat(id, "/variants"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postProductsProductVariantsBody,
    });
};
exports.postProductsProductVariants = postProductsProductVariants;
/**
 * Retrieves a list of the Product Variants associated with a Product.
 * @summary List a Product's Product Variants
 */
var getProductsProductVariants = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/products/".concat(id, "/variants"),
        method: "get",
    });
};
exports.getProductsProductVariants = getProductsProductVariants;
/**
 * Deletes a Product Option. Before a Product Option can be deleted all Option Values for the Product Option must be the same. You may, for example, have to delete some of your variants prior to deleting the Product Option
 * @summary Delete a Product Option
 */
var deleteProductsProductOptionsOption = function (id, optionId) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/products/".concat(id, "/options/").concat(optionId),
        method: "delete",
    });
};
exports.deleteProductsProductOptionsOption = deleteProductsProductOptionsOption;
/**
 * Updates a Product Option
 * @summary Update a Product Option.
 */
var postProductsProductOptionsOption = function (id, optionId, postProductsProductOptionsOptionBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/products/".concat(id, "/options/").concat(optionId),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postProductsProductOptionsOptionBody,
    });
};
exports.postProductsProductOptionsOption = postProductsProductOptionsOption;
/**
 * Deletes a Product and it's associated Product Variants.
 * @summary Delete a Product
 */
var deleteProductsProduct = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/products/".concat(id),
        method: "delete",
    });
};
exports.deleteProductsProduct = deleteProductsProduct;
/**
 * Retrieves a Product.
 * @summary Retrieve a Product
 */
var getProductsProduct = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/products/".concat(id),
        method: "get",
    });
};
exports.getProductsProduct = getProductsProduct;
/**
 * Updates a Product
 * @summary Update a Product
 */
var postProductsProduct = function (id, postProductsProductBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/products/".concat(id),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postProductsProductBody,
    });
};
exports.postProductsProduct = postProductsProduct;
/**
 * Deletes a Product Variant.
 * @summary Delete a Product Variant
 */
var deleteProductsProductVariantsVariant = function (id, variantId) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/products/".concat(id, "/variants/").concat(variantId),
        method: "delete",
    });
};
exports.deleteProductsProductVariantsVariant = deleteProductsProductVariantsVariant;
/**
 * Update a Product Variant.
 * @summary Update a Product Variant
 */
var postProductsProductVariantsVariant = function (id, variantId, postProductsProductVariantsVariantBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/products/".concat(id, "/variants/").concat(variantId),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postProductsProductVariantsVariantBody,
    });
};
exports.postProductsProductVariantsVariant = postProductsProductVariantsVariant;
/**
 * Retrieves a list of Product Types.
 * @summary List Product Types
 */
var getProductsTypes = function () {
    return (0, custom_instance_1.getClient)({
        url: "/admin/products/types",
        method: "get",
    });
};
exports.getProductsTypes = getProductsTypes;
/**
 * Set metadata key/value pair for Product
 * @summary Set Product metadata
 */
var postProductsProductMetadata = function (id, postProductsProductMetadataBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/products/".concat(id, "/metadata"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postProductsProductMetadataBody,
    });
};
exports.postProductsProductMetadata = postProductsProductMetadata;
//# sourceMappingURL=product.js.map