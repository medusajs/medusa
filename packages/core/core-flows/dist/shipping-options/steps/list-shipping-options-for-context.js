"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listShippingOptionsForContextStep = exports.listShippingOptionsForContextStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.listShippingOptionsForContextStepId = "list-shipping-options-for-context";
exports.listShippingOptionsForContextStep = (0, workflows_sdk_1.createStep)(exports.listShippingOptionsForContextStepId, async (data, { container }) => {
    const fulfillmentService = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    const shippingOptions = await fulfillmentService.listShippingOptionsForContext(data.context, data.config);
    return new workflows_sdk_1.StepResponse(shippingOptions);
});
