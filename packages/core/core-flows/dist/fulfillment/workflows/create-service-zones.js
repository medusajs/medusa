"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServiceZonesWorkflow = exports.createServiceZonesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createServiceZonesWorkflowId = "create-service-zones-workflow";
exports.createServiceZonesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createServiceZonesWorkflowId, (input) => {
    const serviceZones = (0, steps_1.createServiceZonesStep)(input.data);
    return serviceZones;
});
