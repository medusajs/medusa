"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUsersWorkflow = exports.deleteUsersWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.deleteUsersWorkflowId = "delete-user";
exports.deleteUsersWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deleteUsersWorkflowId, (input) => {
    return (0, steps_1.deleteUsersStep)(input.ids);
});
