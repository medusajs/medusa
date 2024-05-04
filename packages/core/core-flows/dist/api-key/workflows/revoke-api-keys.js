"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeApiKeysWorkflow = exports.revokeApiKeysWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.revokeApiKeysWorkflowId = "revoke-api-keys";
exports.revokeApiKeysWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.revokeApiKeysWorkflowId, (input) => {
    return (0, steps_1.revokeApiKeysStep)(input);
});
