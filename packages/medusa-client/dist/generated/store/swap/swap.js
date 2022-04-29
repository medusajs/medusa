"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSwapsSwapCartId = exports.postSwaps = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Creates a Swap on an Order by providing some items to return along with some items to send back
 * @summary Create a Swap
 */
var postSwaps = function (postSwapsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/swaps",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postSwapsBody,
    });
};
exports.postSwaps = postSwaps;
/**
 * Retrieves a Swap by the id of the Cart used to confirm the Swap.
 * @summary Retrieve Swap by Cart id
 */
var getSwapsSwapCartId = function (cartId) {
    return (0, custom_instance_1.getClient)({
        url: "/swaps/".concat(cartId),
        method: "get",
    });
};
exports.getSwapsSwapCartId = getSwapsSwapCartId;
//# sourceMappingURL=swap.js.map