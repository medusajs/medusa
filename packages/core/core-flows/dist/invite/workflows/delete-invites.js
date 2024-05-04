"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInvitesWorkflow = exports.deleteInvitesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.deleteInvitesWorkflowId = "delete-invites-workflow";
exports.deleteInvitesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deleteInvitesWorkflowId, (input) => {
    return (0, steps_1.deleteInvitesStep)(input.ids);
});
