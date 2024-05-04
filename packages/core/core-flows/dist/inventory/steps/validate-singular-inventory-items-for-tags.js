"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInventoryItemsForCreate = exports.validateInventoryItemsForCreateStepId = void 0;
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.validateInventoryItemsForCreateStepId = "validate-inventory-items-for-create-step";
exports.validateInventoryItemsForCreate = (0, workflows_sdk_1.createStep)(exports.validateInventoryItemsForCreateStepId, async (input, { container }) => {
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    const linkService = remoteLink.getLinkModule(modules_sdk_1.Modules.PRODUCT, "variant_id", modules_sdk_1.Modules.INVENTORY, "inventory_item_id");
    const existingItems = await linkService.list({ variant_id: input.map((i) => i.tag) }, { select: ["variant_id", "inventory_item_id"] });
    if (existingItems.length) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_ALLOWED, "Inventory items already exist for variants with ids: " +
            existingItems.map((i) => i.variant_id).join(", "));
    }
    return new workflows_sdk_1.StepResponse(input);
});
