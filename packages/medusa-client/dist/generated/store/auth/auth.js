"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthEmail = exports.getAuth = exports.deleteAuth = exports.postAuth = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Logs a Customer in and authorizes them to view their details. Successful authentication will set a session cookie in the Customer's browser.
 * @summary Authenticate Customer
 */
var postAuth = function (postAuthBody) {
    return (0, custom_instance_1.getClient)({
        url: "/auth",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postAuthBody,
    });
};
exports.postAuth = postAuth;
/**
 * Destroys a Customer's authenticated session.
 * @summary Log out
 */
var deleteAuth = function () {
    return (0, custom_instance_1.getClient)({ url: "/auth", method: "delete" });
};
exports.deleteAuth = deleteAuth;
/**
 * Gets the currently logged in Customer.
 * @summary Get Session
 */
var getAuth = function () {
    return (0, custom_instance_1.getClient)({ url: "/auth", method: "get" });
};
exports.getAuth = getAuth;
/**
 * Checks if a Customer with the given email has signed up.
 * @summary Check if email has account
 */
var getAuthEmail = function (email) {
    return (0, custom_instance_1.getClient)({ url: "/auth/".concat(email), method: "get" });
};
exports.getAuthEmail = getAuthEmail;
//# sourceMappingURL=auth.js.map