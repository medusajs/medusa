"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVariants = exports.getVariantsVariant = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Retrieves a Product Variant by id
 * @summary Retrieve a Product Variant
 */
var getVariantsVariant = function (variantId) {
    return (0, custom_instance_1.getClient)({
        url: "/variants/".concat(variantId),
        method: "get",
    });
};
exports.getVariantsVariant = getVariantsVariant;
/**
 * Retrieves a list of Product Variants
 * @summary Retrieve Product Variants
 */
var getVariants = function (params) {
    return (0, custom_instance_1.getClient)({ url: "/variants", method: "get", params: params });
};
exports.getVariants = getVariants;
//# sourceMappingURL=product-variant.js.map