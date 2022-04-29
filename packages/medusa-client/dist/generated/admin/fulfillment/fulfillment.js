"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postOrdersOrderFulfillmentsCancel = exports.postOrdersSwapFulfillmentsCancel = exports.postOrdersClaimFulfillmentsCancel = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Registers a Fulfillment as canceled.
 * @summary Cancels a fulfilmment related to a Claim
 */
var postOrdersClaimFulfillmentsCancel = function (id, claimId, fulfillmentId) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/orders/".concat(id, "/claims/").concat(claimId, "/fulfillments/").concat(fulfillmentId, "/cancel"),
        method: "post",
    });
};
exports.postOrdersClaimFulfillmentsCancel = postOrdersClaimFulfillmentsCancel;
/**
 * Registers a Fulfillment as canceled.
 * @summary Cancels a fulfilmment related to a Swap
 */
var postOrdersSwapFulfillmentsCancel = function (id, swapId, fulfillmentId) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/orders/".concat(id, "/swaps/").concat(swapId, "/fulfillments/").concat(fulfillmentId, "/cancel"),
        method: "post",
    });
};
exports.postOrdersSwapFulfillmentsCancel = postOrdersSwapFulfillmentsCancel;
/**
 * Registers a Fulfillment as canceled.
 * @summary Cancels a fulfilmment
 */
var postOrdersOrderFulfillmentsCancel = function (id, fulfillmentId) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/orders/".concat(id, "/fulfillments/").concat(fulfillmentId, "/cancel"),
        method: "post",
    });
};
exports.postOrdersOrderFulfillmentsCancel = postOrdersOrderFulfillmentsCancel;
//# sourceMappingURL=fulfillment.js.map