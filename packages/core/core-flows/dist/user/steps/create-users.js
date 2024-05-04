"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUsersStep = exports.createUsersStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.createUsersStepId = "create-users-step";
exports.createUsersStep = (0, workflows_sdk_1.createStep)(exports.createUsersStepId, async (input, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.USER);
    const users = await service.create(input);
    return new workflows_sdk_1.StepResponse(users);
}, async (createdUsers, { container }) => {
    if (!createdUsers?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.USER);
    await service.delete(createdUsers);
});
