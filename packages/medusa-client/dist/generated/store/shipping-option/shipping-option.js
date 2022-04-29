"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShippingOptionsCartId = exports.getShippingOptions = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Retrieves a list of Shipping Options.
 * @summary Retrieve Shipping Options
 */
var getShippingOptions = function (params) {
    return (0, custom_instance_1.getClient)({
        url: "/shipping-options",
        method: "get",
        params: params,
    });
};
exports.getShippingOptions = getShippingOptions;
/**
 * Retrieves a list of Shipping Options available to a cart.
 * @summary Retrieve Shipping Options for Cart
 */
var getShippingOptionsCartId = function (cartId) {
    return (0, custom_instance_1.getClient)({
        url: "/shipping-options/".concat(cartId),
        method: "get",
    });
};
exports.getShippingOptionsCartId = getShippingOptionsCartId;
//# sourceMappingURL=shipping-option.js.map