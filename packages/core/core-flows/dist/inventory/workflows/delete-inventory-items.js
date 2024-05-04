"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInventoryItemWorkflow = exports.deleteInventoryItemWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
const steps_1 = require("../steps");
const remove_remote_links_1 = require("../../common/steps/remove-remote-links");
exports.deleteInventoryItemWorkflowId = "delete-inventory-item-workflow";
exports.deleteInventoryItemWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deleteInventoryItemWorkflowId, (input) => {
    (0, steps_1.deleteInventoryItemStep)(input);
    (0, remove_remote_links_1.removeRemoteLinkStep)({
        [modules_sdk_1.Modules.INVENTORY]: { inventory_item_id: input },
    });
    return input;
});
