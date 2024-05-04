"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmInventoryStep = exports.confirmInventoryStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const medusa_core_utils_1 = require("medusa-core-utils");
exports.confirmInventoryStepId = "confirm-inventory-step";
exports.confirmInventoryStep = (0, workflows_sdk_1.createStep)(exports.confirmInventoryStepId, async (data, { container }) => {
    const inventoryService = container.resolve(modules_sdk_1.ModuleRegistrationName.INVENTORY);
    // TODO: Should be bulk
    const promises = data.items.map(async (item) => {
        const itemQuantity = item.required_quantity * item.quantity;
        return await inventoryService.confirmInventory(item.inventory_item_id, item.location_ids, itemQuantity);
    });
    const inventoryCoverage = await (0, utils_1.promiseAll)(promises);
    if (inventoryCoverage.some((hasCoverage) => !hasCoverage)) {
        throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_ALLOWED, `Some variant does not have the required inventory`, medusa_core_utils_1.MedusaError.Codes.INSUFFICIENT_INVENTORY);
    }
    return new workflows_sdk_1.StepResponse(null);
});
