"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInviteStep = exports.createInviteStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createInviteStepId = "create-invite-step";
exports.createInviteStep = (0, workflows_sdk_1.createStep)(exports.createInviteStepId, async (input, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.USER);
    const createdInvites = await service.createInvites(input);
    return new workflows_sdk_1.StepResponse(createdInvites, createdInvites.map((inv) => inv.id));
}, async (createdInvitesIds, { container }) => {
    if (!createdInvitesIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.USER);
    await service.deleteInvites(createdInvitesIds);
});
