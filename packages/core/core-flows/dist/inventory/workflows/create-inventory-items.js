"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInventoryItemsWorkflow = exports.createInventoryItemsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createInventoryItemsWorkflowId = "create-inventory-items-workflow";
exports.createInventoryItemsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createInventoryItemsWorkflowId, (input) => {
    const items = (0, steps_1.createInventoryItemsStep)(input.items);
    return items;
});
