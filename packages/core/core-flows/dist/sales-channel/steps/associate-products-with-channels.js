"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associateProductsWithSalesChannelsStep = exports.associateProductsWithSalesChannelsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.associateProductsWithSalesChannelsStepId = "associate-products-with-channels";
exports.associateProductsWithSalesChannelsStep = (0, workflows_sdk_1.createStep)(exports.associateProductsWithSalesChannelsStepId, async (input, { container }) => {
    if (!input.links?.length) {
        return new workflows_sdk_1.StepResponse([], []);
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
    const createdLinks = await remoteLink.create(links);
    return new workflows_sdk_1.StepResponse(createdLinks, links);
}, async (links, { container }) => {
    if (!links) {
        return;
    }
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    await remoteLink.dismiss(links);
});
