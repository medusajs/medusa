"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStockLocationsWorkflow = exports.updateStockLocationsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.updateStockLocationsWorkflowId = "update-stock-locations-workflow";
exports.updateStockLocationsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateStockLocationsWorkflowId, (input) => {
    return (0, steps_1.updateStockLocationsStep)(input);
});
