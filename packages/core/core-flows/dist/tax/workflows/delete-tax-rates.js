"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaxRatesWorkflow = exports.deleteTaxRatesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.deleteTaxRatesWorkflowId = "delete-tax-rates";
exports.deleteTaxRatesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deleteTaxRatesWorkflowId, (input) => {
    return (0, steps_1.deleteTaxRatesStep)(input.ids);
});
