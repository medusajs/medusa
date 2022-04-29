"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postUsersUserPassword = exports.getUsersUser = exports.postUsersUser = exports.deleteUsersUser = exports.getUsers = exports.postUsers = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Creates a User
 * @summary Create a User
 */
var postUsers = function (postUsersBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/users",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postUsersBody,
    });
};
exports.postUsers = postUsers;
/**
 * Retrieves all users.
 * @summary Retrieve all users
 */
var getUsers = function () {
    return (0, custom_instance_1.getClient)({ url: "/admin/users", method: "get" });
};
exports.getUsers = getUsers;
/**
 * Deletes a User
 * @summary Delete a User
 */
var deleteUsersUser = function (userId) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/users/".concat(userId),
        method: "delete",
    });
};
exports.deleteUsersUser = deleteUsersUser;
/**
 * Updates a User
 * @summary Update a User
 */
var postUsersUser = function (userId, postUsersUserBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/users/".concat(userId),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postUsersUserBody,
    });
};
exports.postUsersUser = postUsersUser;
/**
 * Retrieves a User.
 * @summary Retrieve a User
 */
var getUsersUser = function (id) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/users/".concat(id),
        method: "get",
    });
};
exports.getUsersUser = getUsersUser;
/**
 * Sets the password for a User given the correct token.
 * @summary Set the password for a User.
 */
var postUsersUserPassword = function (postUsersUserPasswordBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/users/password-token",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postUsersUserPasswordBody,
    });
};
exports.postUsersUserPassword = postUsersUserPassword;
//# sourceMappingURL=users.js.map