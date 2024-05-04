"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserAccountWorkflow = exports.createUserAccountWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../../auth/steps");
const steps_2 = require("../steps");
exports.createUserAccountWorkflowId = "create-user-account";
exports.createUserAccountWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createUserAccountWorkflowId, (input) => {
    const users = (0, steps_2.createUsersStep)([input.userData]);
    const user = (0, workflows_sdk_1.transform)(users, (users) => users[0]);
    (0, steps_1.setAuthAppMetadataStep)({
        authUserId: input.authUserId,
        key: "user_id",
        value: user.id,
    });
    return user;
});
