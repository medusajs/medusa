"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postInvitesInviteResend = exports.deleteInvitesInvite = exports.getInvites = exports.postInvites = exports.postInvitesInviteAccept = void 0;
var custom_instance_1 = require("../../../src/custom-instance");
/**
 * Accepts an Invite and creates a corresponding user
 * @summary Accept an Invite
 */
var postInvitesInviteAccept = function (postInvitesInviteAcceptBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/invites/accept",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postInvitesInviteAcceptBody,
    });
};
exports.postInvitesInviteAccept = postInvitesInviteAccept;
/**
 * Creates an Invite and triggers an 'invite' created event
 * @summary Create an Invite
 */
var postInvites = function (postInvitesBody) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/invites",
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: postInvitesBody,
    });
};
exports.postInvites = postInvites;
/**
 * Lists all Invites
 * @summary Lists all Invites
 */
var getInvites = function () {
    return (0, custom_instance_1.getClient)({ url: "/admin/invites", method: "get" });
};
exports.getInvites = getInvites;
/**
 * Creates an Invite and triggers an 'invite' created event
 * @summary Create an Invite
 */
var deleteInvitesInvite = function (inviteId) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/invites/".concat(inviteId),
        method: "delete",
    });
};
exports.deleteInvitesInvite = deleteInvitesInvite;
/**
 * Resends an Invite by triggering the 'invite' created event again
 * @summary Resend an Invite
 */
var postInvitesInviteResend = function (inviteId) {
    return (0, custom_instance_1.getClient)({
        url: "/admin/invites/".concat(inviteId, "/resend"),
        method: "post",
    });
};
exports.postInvitesInviteResend = postInvitesInviteResend;
//# sourceMappingURL=invites.js.map