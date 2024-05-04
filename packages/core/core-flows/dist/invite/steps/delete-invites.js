"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInvitesStep = exports.deleteInvitesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.deleteInvitesStepId = "delete-invites-step";
exports.deleteInvitesStep = (0, workflows_sdk_1.createStep)(exports.deleteInvitesStepId, async (input, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.USER);
    await service.softDeleteInvites(input);
    return new workflows_sdk_1.StepResponse(void 0, input);
}, async (deletedInviteIds, { container }) => {
    if (!deletedInviteIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.USER);
    await service.restoreInvites(deletedInviteIds);
});
