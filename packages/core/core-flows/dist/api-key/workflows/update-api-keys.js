"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApiKeysWorkflow = exports.updateApiKeysWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.updateApiKeysWorkflowId = "update-api-keys";
exports.updateApiKeysWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateApiKeysWorkflowId, (input) => {
    return (0, steps_1.updateApiKeysStep)(input);
});
