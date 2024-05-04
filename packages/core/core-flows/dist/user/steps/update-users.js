"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUsersStep = exports.updateUsersStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updateUsersStepId = "update-users-step";
exports.updateUsersStep = (0, workflows_sdk_1.createStep)(exports.updateUsersStepId, async (input, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.USER);
    if (!input.length) {
        return new workflows_sdk_1.StepResponse([], []);
    }
    const originalUsers = await service.list({
        id: input.map((u) => u.id),
    });
    const users = await service.update(input);
    return new workflows_sdk_1.StepResponse(users, originalUsers);
}, async (originalUsers, { container }) => {
    if (!originalUsers?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.USER);
    await service.update(originalUsers.map((u) => ({
        id: u.id,
        first_name: u.first_name,
        last_name: u.last_name,
        email: u.email,
        avatar_url: u.avatar_url,
        metadata: u.metadata,
    })));
});
