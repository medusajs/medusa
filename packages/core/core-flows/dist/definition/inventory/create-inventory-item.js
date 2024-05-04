"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInventoryItems = exports.CreateInventoryItemActions = void 0;
const definitions_1 = require("../../definitions");
const orchestration_1 = require("@medusajs/orchestration");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const handlers_1 = require("../../handlers");
var CreateInventoryItemActions;
(function (CreateInventoryItemActions) {
    CreateInventoryItemActions["prepare"] = "prepare";
    CreateInventoryItemActions["createInventoryItems"] = "createInventoryItems";
})(CreateInventoryItemActions || (exports.CreateInventoryItemActions = CreateInventoryItemActions = {}));
const workflowSteps = {
    next: {
        action: CreateInventoryItemActions.createInventoryItems,
    },
};
const handlers = new Map([
    [
        CreateInventoryItemActions.createInventoryItems,
        {
            invoke: (0, workflows_sdk_1.pipe)({
                inputAlias: CreateInventoryItemActions.prepare,
                merge: true,
                invoke: {
                    from: CreateInventoryItemActions.prepare,
                },
            }, handlers_1.InventoryHandlers.createInventoryItems),
            compensate: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: {
                    from: CreateInventoryItemActions.createInventoryItems,
                    alias: handlers_1.InventoryHandlers.removeInventoryItems.aliases.inventoryItems,
                },
            }, handlers_1.InventoryHandlers.removeInventoryItems),
        },
    ],
]);
orchestration_1.WorkflowManager.register(definitions_1.Workflows.CreateInventoryItems, workflowSteps, handlers);
exports.createInventoryItems = (0, workflows_sdk_1.exportWorkflow)(definitions_1.Workflows.CreateInventoryItems, CreateInventoryItemActions.createInventoryItems, async (data) => data);
