"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCollectionsWorkflow = exports.deleteCollectionsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.deleteCollectionsWorkflowId = "delete-collections";
exports.deleteCollectionsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deleteCollectionsWorkflowId, (input) => {
    return (0, steps_1.deleteCollectionsStep)(input.ids);
});
