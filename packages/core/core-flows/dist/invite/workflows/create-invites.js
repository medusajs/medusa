"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvitesWorkflow = exports.createInvitesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createInvitesWorkflowId = "create-invite-step";
exports.createInvitesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createInvitesWorkflowId, (input) => {
    return (0, steps_1.createInviteStep)(input.invites);
});
