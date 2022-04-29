"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApps = exports.postApps = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Generates a token for an application.
 * @summary Generates a token for an application.
 */
var postApps = function (postAppsBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/apps",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postAppsBody,
    });
};
exports.postApps = postApps;
/**
 * Retrieve a list of applications.
 * @summary List applications
 */
var getApps = function () {
    return (0, custom_instance_1.getClient)({ url: "/admin/apps", method: "get" });
};
exports.getApps = getApps;
//# sourceMappingURL=apps.js.map