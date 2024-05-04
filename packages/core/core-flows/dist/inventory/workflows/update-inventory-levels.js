"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInventoryLevelsWorkflow = exports.updateInventoryLevelsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const update_inventory_levels_1 = require("../steps/update-inventory-levels");
exports.updateInventoryLevelsWorkflowId = "update-inventory-levels-workflow";
exports.updateInventoryLevelsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateInventoryLevelsWorkflowId, (input) => {
    return (0, update_inventory_levels_1.updateInventoryLevelsStep)(input.updates);
});
