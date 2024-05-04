"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTokenStep = exports.validateTokenStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const workflows_sdk_2 = require("@medusajs/workflows-sdk");
exports.validateTokenStepId = "validate-invite-token-step";
exports.validateTokenStep = (0, workflows_sdk_2.createStep)(exports.validateTokenStepId, async (input, { container }) => {
    const userModuleService = container.resolve(modules_sdk_1.ModuleRegistrationName.USER);
    const invite = await userModuleService.validateInviteToken(input);
    return new workflows_sdk_1.StepResponse(invite);
});
