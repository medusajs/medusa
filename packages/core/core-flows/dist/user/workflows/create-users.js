"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUsersWorkflow = exports.createUsersWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createUsersWorkflowId = "create-users-workflow";
exports.createUsersWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createUsersWorkflowId, (input) => {
    return (0, steps_1.createUsersStep)(input.users);
});
