"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFilesStep = exports.deleteFilesStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.deleteFilesStepId = "delete-files";
exports.deleteFilesStep = (0, workflows_sdk_1.createStep)({ name: exports.deleteFilesStepId, noCompensation: true }, async (ids, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.FILE);
    await service.delete(ids);
    return new workflows_sdk_1.StepResponse(void 0);
}, async () => { });
