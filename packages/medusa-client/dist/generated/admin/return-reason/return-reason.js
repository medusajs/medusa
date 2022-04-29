"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postReturnReasonsReason = exports.getReturnReasonsReason = exports.deleteReturnReason = exports.getReturnReasons = exports.postReturnReasons = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Creates a Return Reason
 * @summary Create a Return Reason
 */
var postReturnReasons = function (postReturnReasonsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/return-reasons",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postReturnReasonsBody,
    });
};
exports.postReturnReasons = postReturnReasons;
/**
 * Retrieves a list of Return Reasons.
 * @summary List Return Reasons
 */
var getReturnReasons = function () {
    return (0, custom_instance_1.getClient)({
        url: "/admin/return-reasons",
        method: "get",
    });
};
exports.getReturnReasons = getReturnReasons;
/**
 * Deletes a return reason.
 * @summary Delete a return reason
 */
var deleteReturnReason = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/return-reasons/".concat(id),
        method: "delete",
    });
};
exports.deleteReturnReason = deleteReturnReason;
/**
 * Retrieves a Return Reason.
 * @summary Retrieve a Return Reason
 */
var getReturnReasonsReason = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/return-reasons/".concat(id),
        method: "get",
    });
};
exports.getReturnReasonsReason = getReturnReasonsReason;
/**
 * Updates a Return Reason
 * @summary Update a Return Reason
 */
var postReturnReasonsReason = function (id, postReturnReasonsReasonBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/return-reasons/".concat(id),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postReturnReasonsReasonBody,
    });
};
exports.postReturnReasonsReason = postReturnReasonsReason;
//# sourceMappingURL=return-reason.js.map