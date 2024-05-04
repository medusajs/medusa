"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLineItemsStep = exports.listLineItemsStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.listLineItemsStepId = "list-line-items";
exports.listLineItemsStep = (0, workflows_sdk_1.createStep)(exports.listLineItemsStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.CART);
    const items = await service.listLineItems(data.filters, data.config);
    return new workflows_sdk_1.StepResponse(items);
});
