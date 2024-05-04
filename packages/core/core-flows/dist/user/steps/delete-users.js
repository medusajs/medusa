"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUsersStep = exports.deleteUsersStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.deleteUsersStepId = "delete-users-step";
exports.deleteUsersStep = (0, workflows_sdk_1.createStep)(exports.deleteUsersStepId, async (input, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.USER);
    await service.softDelete(input);
    return new workflows_sdk_1.StepResponse(void 0, input);
}, async (prevUserIds, { container }) => {
    if (!prevUserIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.USER);
    await service.restore(prevUserIds);
});
