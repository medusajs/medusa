"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuth = exports.postAuth = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Logs a User in and authorizes them to manage Store settings.
 * @summary Authenticate a User
 */
var postAuth = function (postAuthBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/auth",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postAuthBody,
    });
};
exports.postAuth = postAuth;
/**
 * Gets the currently logged in User.
 * @summary Get Session
 */
var getAuth = function () {
    return (0, custom_instance_1.getClient)({ url: "/admin/auth", method: "get" });
};
exports.getAuth = getAuth;
//# sourceMappingURL=auth.js.map