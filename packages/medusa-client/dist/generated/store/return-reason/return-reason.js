"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReturnReasons = exports.getReturnReasonsReason = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Retrieves a Return Reason.
 * @summary Retrieve a Return Reason
 */
var getReturnReasonsReason = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/return-reasons/".concat(id),
        method: "get",
    });
};
exports.getReturnReasonsReason = getReturnReasonsReason;
/**
 * Retrieves a list of Return Reasons.
 * @summary List Return Reasons
 */
var getReturnReasons = function () {
    return (0, custom_instance_1.getClient)({
        url: "/return-reasons",
        method: "get",
    });
};
exports.getReturnReasons = getReturnReasons;
//# sourceMappingURL=return-reason.js.map