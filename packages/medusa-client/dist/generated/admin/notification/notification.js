"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postNotificationsNotificationResend = exports.getNotifications = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Retrieves a list of Notifications.
 * @summary List Notifications
 */
var getNotifications = function (params) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/notifications",
        method: "get",
        params: params,
    });
};
exports.getNotifications = getNotifications;
/**
 * Resends a previously sent notifications, with the same data but optionally to a different address
 * @summary Resend Notification
 */
var postNotificationsNotificationResend = function (id, postNotificationsNotificationResendBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/notifications/".concat(id, "/resend"),
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postNotificationsNotificationResendBody,
    });
};
exports.postNotificationsNotificationResend = postNotificationsNotificationResend;
//# sourceMappingURL=notification.js.map