"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStoresWorkflow = exports.createStoresWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createStoresWorkflowId = "create-stores";
exports.createStoresWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createStoresWorkflowId, (input) => {
    return (0, steps_1.createStoresStep)(input);
});
