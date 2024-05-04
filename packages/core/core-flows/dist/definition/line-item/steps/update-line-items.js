"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLineItemsStep = exports.updateLineItemsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.updateLineItemsStepId = "update-line-items";
exports.updateLineItemsStep = (0, workflows_sdk_1.createStep)(exports.updateLineItemsStepId, async (input, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
    const { selects, relations } = (0, utils_1.getSelectsAndRelationsFromObjectArray)([
        input.data,
    ]);
    const itemsBefore = await service.listLineItems(input.selector, {
        select: selects,
        relations,
    });
    const items = await service.updateLineItems(input.selector, input.data);
    return new workflows_sdk_1.StepResponse(items, itemsBefore);
}, async (itemsBefore, { container }) => {
    if (!itemsBefore) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
    await (0, utils_1.promiseAll)(itemsBefore.map(async (i) => service.updateLineItems(i.id, (0, utils_1.removeUndefined)({
        quantity: i.quantity,
        title: i.title,
        metadata: i.metadata,
        unit_price: i.unit_price,
        tax_lines: i.tax_lines,
        adjustments: i.adjustments,
    }))));
});
