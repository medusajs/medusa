"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCollectionsWorkflow = exports.updateCollectionsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.updateCollectionsWorkflowId = "update-collections";
exports.updateCollectionsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateCollectionsWorkflowId, (input) => {
    return (0, steps_1.updateCollectionsStep)(input);
});
