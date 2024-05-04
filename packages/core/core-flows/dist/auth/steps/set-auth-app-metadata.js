"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthAppMetadataStep = exports.setAuthAppMetadataStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
exports.setAuthAppMetadataStepId = "set-auth-app-metadata";
exports.setAuthAppMetadataStep = (0, workflows_sdk_1.createStep)(exports.setAuthAppMetadataStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.AUTH);
    const authUser = await service.retrieve(data.authUserId);
    const appMetadata = authUser.app_metadata || {};
    if ((0, utils_1.isDefined)(appMetadata[data.key])) {
        throw new Error(`Key ${data.key} already exists in app metadata`);
    }
    appMetadata[data.key] = data.value;
    await service.update({
        id: authUser.id,
        app_metadata: appMetadata,
    });
    return new workflows_sdk_1.StepResponse(authUser, { id: authUser.id, key: data.key });
}, async (idAndKey, { container }) => {
    if (!idAndKey) {
        return;
    }
    const { id, key } = idAndKey;
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.AUTH);
    const authUser = await service.retrieve(id);
    const appMetadata = authUser.app_metadata || {};
    if ((0, utils_1.isDefined)(appMetadata[key])) {
        delete appMetadata[key];
    }
    await service.update({
        id: authUser.id,
        app_metadata: appMetadata,
    });
});
