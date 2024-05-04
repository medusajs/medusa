"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkSalesChannelsToApiKeyStep = exports.linkSalesChannelsToApiKeyStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.linkSalesChannelsToApiKeyStepId = "link-sales-channels-to-api-key";
exports.linkSalesChannelsToApiKeyStep = (0, workflows_sdk_1.createStep)(exports.linkSalesChannelsToApiKeyStepId, async (input, { container }) => {
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    if (!input || (!input.add?.length && !input.remove?.length)) {
        return;
    }
    const linksToCreate = (input.add ?? []).map((salesChannelId) => {
        return {
            [modules_sdk_1.Modules.API_KEY]: {
                publishable_key_id: input.id,
            },
            [modules_sdk_1.Modules.SALES_CHANNEL]: {
                sales_channel_id: salesChannelId,
            },
        };
    });
    const linksToDismiss = (input.remove ?? []).map((salesChannelId) => {
        return {
            [modules_sdk_1.Modules.API_KEY]: {
                publishable_key_id: input.id,
            },
            [modules_sdk_1.Modules.SALES_CHANNEL]: {
                sales_channel_id: salesChannelId,
            },
        };
    });
    const promises = [];
    if (linksToCreate.length) {
        promises.push(remoteLink.create(linksToCreate));
    }
    if (linksToDismiss.length) {
        promises.push(remoteLink.dismiss(linksToDismiss));
    }
    await (0, utils_1.promiseAll)(promises);
    return new workflows_sdk_1.StepResponse(void 0, { linksToCreate, linksToDismiss });
}, async (prevData, { container }) => {
    if (!prevData) {
        return;
    }
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    if (prevData.linksToCreate.length) {
        await remoteLink.dismiss(prevData.linksToCreate);
    }
    if (prevData.linksToDismiss.length) {
        await remoteLink.create(prevData.linksToDismiss);
    }
});
