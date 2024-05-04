"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeRemoteLinkStep = exports.removeRemoteLinkStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const utils_1 = require("@medusajs/utils");
exports.removeRemoteLinkStepId = "remove-remote-links";
exports.removeRemoteLinkStep = (0, workflows_sdk_1.createStep)(exports.removeRemoteLinkStepId, async (data, { container }) => {
    var _a;
    const entries = Array.isArray(data) ? data : [data];
    const grouped = {};
    for (const entry of entries) {
        for (const moduleName of Object.keys(entry)) {
            grouped[moduleName] ?? (grouped[moduleName] = {});
            for (const linkableKey of Object.keys(entry[moduleName])) {
                (_a = grouped[moduleName])[linkableKey] ?? (_a[linkableKey] = []);
                const keys = Array.isArray(entry[moduleName][linkableKey])
                    ? entry[moduleName][linkableKey]
                    : [entry[moduleName][linkableKey]];
                grouped[moduleName][linkableKey] = grouped[moduleName][linkableKey].concat(keys);
            }
        }
    }
    const link = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    await link.delete(grouped);
    return new workflows_sdk_1.StepResponse(grouped, grouped);
}, async (removedLinks, { container }) => {
    if (!removedLinks) {
        return;
    }
    const link = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    await link.restore(removedLinks);
});
