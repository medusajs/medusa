"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshInviteTokensWorkflow = exports.refreshInviteTokensWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const refresh_invite_tokens_1 = require("../steps/refresh-invite-tokens");
exports.refreshInviteTokensWorkflowId = "refresh-invite-tokens-workflow";
exports.refreshInviteTokensWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.refreshInviteTokensWorkflowId, (input) => {
    return (0, refresh_invite_tokens_1.refreshInviteTokensStep)(input.invite_ids);
});
