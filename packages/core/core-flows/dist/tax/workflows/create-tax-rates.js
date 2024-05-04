"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaxRatesWorkflow = exports.createTaxRatesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createTaxRatesWorkflowId = "create-tax-rates";
exports.createTaxRatesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createTaxRatesWorkflowId, (input) => {
    return (0, steps_1.createTaxRatesStep)(input);
});
