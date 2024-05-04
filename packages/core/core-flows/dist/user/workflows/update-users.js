"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUsersWorkflow = exports.updateUsersWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.updateUsersWorkflowId = "update-users-workflow";
exports.updateUsersWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateUsersWorkflowId, (input) => {
    return (0, steps_1.updateUsersStep)(input.updates);
});
