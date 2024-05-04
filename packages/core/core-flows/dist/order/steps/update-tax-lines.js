"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderTaxLinesStep = exports.updateOrderTaxLinesStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const update_tax_lines_1 = require("../workflows/update-tax-lines");
exports.updateOrderTaxLinesStepId = "update-order-tax-lines-step";
exports.updateOrderTaxLinesStep = (0, workflows_sdk_1.createStep)(exports.updateOrderTaxLinesStepId, async (input, { container }) => {
    const { transaction } = await (0, update_tax_lines_1.updateOrderTaxLinesWorkflow)(container).run({
        input,
    });
    return new workflows_sdk_1.StepResponse(null, { transaction });
}, async (flow, { container }) => {
    if (!flow) {
        return;
    }
    await (0, update_tax_lines_1.updateOrderTaxLinesWorkflow)(container).cancel({
        transaction: flow.transaction,
    });
});
