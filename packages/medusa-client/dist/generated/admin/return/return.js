"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postReturnsReturnReceive = exports.getReturns = exports.postReturnsReturnCancel = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Registers a Return as canceled.
 * @summary Cancel a Return
 */
var postReturnsReturnCancel = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/returns/".concat(id, "/cancel"),
        method: "post",
    });
};
exports.postReturnsReturnCancel = postReturnsReturnCancel;
/**
 * Retrieves a list of Returns
 * @summary List Returns
 */
var getReturns = function () {
    return (0, custom_instance_1.getClient)({ url: "/admin/returns", method: "get" });
};
exports.getReturns = getReturns;
/**
 * Registers a Return as received. Updates statuses on Orders and Swaps accordingly.
 * @summary Receive a Return
 */
var postReturnsReturnReceive = function (id, postReturnsReturnReceiveBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/returns/".concat(id, "/receive"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postReturnsReturnReceiveBody,
    });
};
exports.postReturnsReturnReceive = postReturnsReturnReceive;
//# sourceMappingURL=return.js.map