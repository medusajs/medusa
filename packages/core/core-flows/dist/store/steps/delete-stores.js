"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStoresStep = exports.deleteStoresStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.deleteStoresStepId = "delete-stores";
exports.deleteStoresStep = (0, workflows_sdk_1.createStep)(exports.deleteStoresStepId, async (ids, { container }) => {
    const storeModule = container.resolve(modules_sdk_1.ModuleRegistrationName.STORE);
    await storeModule.softDelete(ids);
    return new workflows_sdk_1.StepResponse(void 0, ids);
}, async (idsToRestore, { container }) => {
    if (!idsToRestore?.length) {
        return;
    }
    const storeModule = container.resolve(modules_sdk_1.ModuleRegistrationName.STORE);
    await storeModule.restore(idsToRestore);
});
