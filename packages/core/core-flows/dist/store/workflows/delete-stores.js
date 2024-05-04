"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStoresWorkflow = exports.deleteStoresWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.deleteStoresWorkflowId = "delete-stores";
exports.deleteStoresWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deleteStoresWorkflowId, (input) => {
    return (0, steps_1.deleteStoresStep)(input.ids);
});
