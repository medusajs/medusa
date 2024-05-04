"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRegionsWorkflow = exports.deleteRegionsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.deleteRegionsWorkflowId = "delete-regions";
exports.deleteRegionsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deleteRegionsWorkflowId, (input) => {
    return (0, steps_1.deleteRegionsStep)(input.ids);
});
