"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTaxRateIdsStep = exports.listTaxRateIdsStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.listTaxRateIdsStepId = "list-tax-rate-ids";
exports.listTaxRateIdsStep = (0, workflows_sdk_1.createStep)(exports.listTaxRateIdsStepId, async (input, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.TAX);
    const rates = await service.list(input.selector, {
        select: ["id"],
    });
    return new workflows_sdk_1.StepResponse(rates.map((r) => r.id));
});
