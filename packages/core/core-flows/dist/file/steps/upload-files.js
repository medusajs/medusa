"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFilesStep = exports.uploadFilesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.uploadFilesStepId = "upload-files";
exports.uploadFilesStep = (0, workflows_sdk_1.createStep)(exports.uploadFilesStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.FILE);
    const created = await service.create(data.files);
    return new workflows_sdk_1.StepResponse(created, created.map((file) => file.id));
}, async (createdIds, { container }) => {
    if (!createdIds?.length) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.FILE);
    await service.delete(createdIds);
});
