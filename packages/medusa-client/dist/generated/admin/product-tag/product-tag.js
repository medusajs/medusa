"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductTypes = exports.getProductTags = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Retrieve a list of Product Tags.
 * @summary List Product Tags
 */
var getProductTags = function (params) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/product-tags",
        method: "get",
        params: params,
    });
};
exports.getProductTags = getProductTags;
/**
 * Retrieve a list of Product Types.
 * @summary List Product Types
 */
var getProductTypes = function (params) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/product-types",
        method: "get",
        params: params,
    });
};
exports.getProductTypes = getProductTypes;
//# sourceMappingURL=product-tag.js.map