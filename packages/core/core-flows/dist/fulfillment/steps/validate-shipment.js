"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateShipmentStep = exports.validateShipmentStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.validateShipmentStepId = "validate-shipment";
exports.validateShipmentStep = (0, workflows_sdk_1.createStep)(exports.validateShipmentStepId, async (id, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.FULFILLMENT);
    const fulfillment = await service.retrieveFulfillment(id, {
        select: ["shipped_at", "canceled_at", "shipping_option_id"],
    });
    if (fulfillment.shipped_at) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_ALLOWED, "Shipment has already been created");
    }
    if (fulfillment.canceled_at) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_ALLOWED, "Cannot create shipment for a canceled fulfillment");
    }
    if (!fulfillment.shipping_option_id) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_ALLOWED, "Cannot create shipment without a Shipping Option");
    }
    return new workflows_sdk_1.StepResponse(void 0);
});
