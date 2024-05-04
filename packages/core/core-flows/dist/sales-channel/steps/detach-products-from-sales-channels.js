"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detachProductsFromSalesChannelsStep = exports.detachProductsFromSalesChannelsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.detachProductsFromSalesChannelsStepId = "detach-products-from-sales-channels-step";
exports.detachProductsFromSalesChannelsStep = (0, workflows_sdk_1.createStep)(exports.detachProductsFromSalesChannelsStepId, async (input, { container }) => {
    if (!input.links?.length) {
        return new workflows_sdk_1.StepResponse(void 0, []);
    }
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    const links = input.links.map((link) => {
        return {
            [modules_sdk_1.Modules.PRODUCT]: {
                product_id: link.product_id,
            },
            [modules_sdk_1.Modules.SALES_CHANNEL]: {
                sales_channel_id: link.sales_channel_id,
            },
        };
    });
    await remoteLink.dismiss(links);
    return new workflows_sdk_1.StepResponse(void 0, links);
}, async (links, { container }) => {
    if (!links?.length) {
        return;
    }
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    await remoteLink.create(links);
});
