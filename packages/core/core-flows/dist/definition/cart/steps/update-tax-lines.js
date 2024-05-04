"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaxLinesStep = exports.updateTaxLinesStepId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const workflows_1 = require("../workflows");
exports.updateTaxLinesStepId = "update-tax-lines-step";
exports.updateTaxLinesStep = (0, workflows_sdk_1.createStep)(exports.updateTaxLinesStepId, async (input, { container }) => {
    const { transaction } = await (0, workflows_1.updateTaxLinesWorkflow)(container).run({
        input,
    });
    return new workflows_sdk_1.StepResponse(null, { transaction });
}, async (flow, { container }) => {
    if (!flow) {
        return;
    }
    await (0, workflows_1.updateTaxLinesWorkflow)(container).cancel({
        transaction: flow.transaction,
    });
});
