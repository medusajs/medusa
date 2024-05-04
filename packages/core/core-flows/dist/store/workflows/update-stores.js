"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStoresWorkflow = exports.updateStoresWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.updateStoresWorkflowId = "update-stores";
exports.updateStoresWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateStoresWorkflowId, (input) => {
    return (0, steps_1.updateStoresStep)(input);
});
