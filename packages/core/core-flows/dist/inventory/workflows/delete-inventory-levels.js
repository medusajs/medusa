"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInventoryLevelsWorkflow = exports.deleteInventoryLevelsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.deleteInventoryLevelsWorkflowId = "delete-inventory-levels-workflow";
exports.deleteInventoryLevelsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deleteInventoryLevelsWorkflowId, (input) => {
    return (0, steps_1.deleteInventoryLevelsStep)(input.ids);
});
