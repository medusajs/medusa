"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postOrdersClaimCancel = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Cancels a Claim
 * @summary Cancels a Claim
 */
var postOrdersClaimCancel = function (id, claimId) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/orders/".concat(id, "/claims/").concat(claimId, "/cancel"),
        method: "post",
    });
};
exports.postOrdersClaimCancel = postOrdersClaimCancel;
//# sourceMappingURL=claim.js.map