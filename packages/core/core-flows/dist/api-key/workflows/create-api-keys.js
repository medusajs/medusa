"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiKeysWorkflow = exports.createApiKeysWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createApiKeysWorkflowId = "create-api-keys";
exports.createApiKeysWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createApiKeysWorkflowId, (input) => {
    return (0, steps_1.createApiKeysStep)(input);
});
