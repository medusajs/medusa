"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSwaps = exports.getSwapsSwap = exports.postOrdersSwapCancel = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Cancels a Swap
 * @summary Cancels a Swap
 */
var postOrdersSwapCancel = function (id, swapId) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/orders/".concat(id, "/swaps/").concat(swapId, "/cancel"),
        method: "post",
    });
};
exports.postOrdersSwapCancel = postOrdersSwapCancel;
/**
 * Retrieves a Swap.
 * @summary Retrieve a Swap
 */
var getSwapsSwap = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/swaps/".concat(id),
        method: "get",
    });
};
exports.getSwapsSwap = getSwapsSwap;
/**
 * Retrieves a list of Swaps.
 * @summary List Swaps
 */
var getSwaps = function () {
    return (0, custom_instance_1.getClient)({ url: "/admin/swaps", method: "get" });
};
exports.getSwaps = getSwaps;
//# sourceMappingURL=swap.js.map