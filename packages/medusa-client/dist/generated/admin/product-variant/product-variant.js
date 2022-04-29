"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVariants = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Retrieves a list of Product Variants
 * @summary List Product Variants.
 */
var getVariants = function (params) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/variants",
        method: "get",
        params: params,
    });
};
exports.getVariants = getVariants;
//# sourceMappingURL=product-variant.js.map