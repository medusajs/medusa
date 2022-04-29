"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCollectionsCollection = exports.getCollectionsCollection = exports.deleteCollectionsCollection = exports.getCollections = exports.postCollections = exports.deleteProductsFromCollection = exports.postProductsToCollection = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Updates products associated with a Product Collection
 * @summary Updates products associated with a Product Collection
 */
var postProductsToCollection = function (id, postProductsToCollectionBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/collections/".concat(id, "/products/batch"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postProductsToCollectionBody,
    });
};
exports.postProductsToCollection = postProductsToCollection;
/**
 * Removes products associated with a Product Collection
 * @summary Removes products associated with a Product Collection
 */
var deleteProductsFromCollection = function (id, deleteProductsFromCollectionBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/collections/".concat(id, "/products/batch"),
        method: "delete",
        headers: { "Content-Type": "application/json" },
        data: deleteProductsFromCollectionBody,
    });
};
exports.deleteProductsFromCollection = deleteProductsFromCollection;
/**
 * Creates a Product Collection.
 * @summary Create a Product Collection
 */
var postCollections = function (postCollectionsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/collections",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postCollectionsBody,
    });
};
exports.postCollections = postCollections;
/**
 * Retrieve a list of Product Collection.
 * @summary List Product Collections
 */
var getCollections = function (params) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/collections",
        method: "get",
        params: params,
    });
};
exports.getCollections = getCollections;
/**
 * Deletes a Product Collection.
 * @summary Delete a Product Collection
 */
var deleteCollectionsCollection = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/collections/".concat(id),
        method: "delete",
    });
};
exports.deleteCollectionsCollection = deleteCollectionsCollection;
/**
 * Retrieves a Product Collection.
 * @summary Retrieve a Product Collection
 */
var getCollectionsCollection = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/collections/".concat(id),
        method: "get",
    });
};
exports.getCollectionsCollection = getCollectionsCollection;
/**
 * Updates a Product Collection.
 * @summary Update a Product Collection
 */
var postCollectionsCollection = function (id, postCollectionsCollectionBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/collections/".concat(id),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postCollectionsCollectionBody,
    });
};
exports.postCollectionsCollection = postCollectionsCollection;
//# sourceMappingURL=collection.js.map