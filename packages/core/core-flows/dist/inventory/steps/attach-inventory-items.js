"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachInventoryItemToVariants = exports.attachInventoryItemToVariantsStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const utils_1 = require("@medusajs/utils");
exports.attachInventoryItemToVariantsStepId = "attach-inventory-items-to-variants-step";
exports.attachInventoryItemToVariants = (0, workflows_sdk_1.createStep)(exports.attachInventoryItemToVariantsStepId, async (input, { container }) => {
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    const linkDefinitions = input
        .filter(({ tag }) => !!tag)
        .map(({ inventoryItemId, tag }) => ({
        productService: {
            variant_id: tag,
        },
        inventoryService: {
            inventory_item_id: inventoryItemId,
        },
    }));
    const links = await remoteLink.create(linkDefinitions);
    return new workflows_sdk_1.StepResponse(links, linkDefinitions);
}, async (linkDefinitions, { container }) => {
    if (!linkDefinitions?.length) {
        return;
    }
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    await remoteLink.dismiss(linkDefinitions);
});
