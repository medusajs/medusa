"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStockLocationsWorkflow = exports.createStockLocationsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createStockLocationsWorkflowId = "create-stock-locations-workflow";
exports.createStockLocationsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createStockLocationsWorkflowId, (input) => {
    const locations = (0, steps_1.createStockLocations)(input.locations);
    return locations;
});
