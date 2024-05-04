"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTaxRateRuleIdsStep = exports.listTaxRateRuleIdsStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.listTaxRateRuleIdsStepId = "list-tax-rate-rule-ids";
exports.listTaxRateRuleIdsStep = (0, workflows_sdk_1.createStep)(exports.listTaxRateRuleIdsStepId, async (input, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.TAX);
    const rules = await service.listTaxRateRules(input.selector, {
        select: ["id"],
    });
    return new workflows_sdk_1.StepResponse(rules.map((r) => r.id));
});
