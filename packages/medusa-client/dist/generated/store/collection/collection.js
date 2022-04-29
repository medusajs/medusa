"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollections = exports.getCollectionsCollection = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Retrieves a Product Collection.
 * @summary Retrieve a Product Collection
 */
var getCollectionsCollection = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/collections/".concat(id),
        method: "get",
    });
};
exports.getCollectionsCollection = getCollectionsCollection;
/**
 * Retrieve a list of Product Collection.
 * @summary List Product Collections
 */
var getCollections = function (params) {
    return (0, custom_instance_1.getClient)({
        url: "/collections",
        method: "get",
        params: params,
    });
};
exports.getCollections = getCollections;
//# sourceMappingURL=collection.js.map