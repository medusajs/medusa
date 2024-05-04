"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshInviteTokensStep = exports.refreshInviteTokensStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.refreshInviteTokensStepId = "refresh-invite-tokens-step";
exports.refreshInviteTokensStep = (0, workflows_sdk_1.createStep)(exports.refreshInviteTokensStepId, async (input, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.USER);
    const invites = await service.refreshInviteTokens(input);
    return new workflows_sdk_1.StepResponse(invites);
});
