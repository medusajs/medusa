"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptInviteWorkflow = exports.acceptInviteWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const auth_1 = require("../../auth");
const user_1 = require("../../user");
const steps_1 = require("../steps");
const validate_token_1 = require("../steps/validate-token");
exports.acceptInviteWorkflowId = "accept-invite-workflow";
exports.acceptInviteWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.acceptInviteWorkflowId, (input) => {
    const invite = (0, validate_token_1.validateTokenStep)(input.invite_token);
    const createUserInput = (0, workflows_sdk_1.transform)({ input, invite }, ({ input, invite }) => {
        return [
            {
                ...input.user,
                email: input.user.email ?? invite.email,
            },
        ];
    });
    const users = (0, user_1.createUsersStep)(createUserInput);
    const authUserInput = (0, workflows_sdk_1.transform)({ input, users }, ({ input, users }) => {
        const createdUser = users[0];
        return {
            authUserId: input.auth_user_id,
            key: "user_id",
            value: createdUser.id,
        };
    });
    (0, auth_1.setAuthAppMetadataStep)(authUserInput);
    (0, steps_1.deleteInvitesStep)([invite.id]);
    return users;
});
