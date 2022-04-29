"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postReturns = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Creates a Return for an Order.
 * @summary Create Return
 */
var postReturns = function (postReturnsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/returns",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postReturnsBody,
    });
};
exports.postReturns = postReturns;
//# sourceMappingURL=return.js.map