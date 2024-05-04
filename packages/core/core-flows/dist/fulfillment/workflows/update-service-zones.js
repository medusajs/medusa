"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateServiceZonesWorkflow = exports.updateServiceZonesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const update_service_zones_1 = require("../steps/update-service-zones");
exports.updateServiceZonesWorkflowId = "update-service-zones-workflow";
exports.updateServiceZonesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateServiceZonesWorkflowId, (input) => {
    const serviceZones = (0, update_service_zones_1.updateServiceZonesStep)(input);
    return serviceZones;
});
