"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStockLocationsWorkflow = exports.deleteStockLocationsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const remove_remote_links_1 = require("../../common/steps/remove-remote-links");
const steps_1 = require("../steps");
exports.deleteStockLocationsWorkflowId = "delete-stock-locations-workflow";
exports.deleteStockLocationsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deleteStockLocationsWorkflowId, (input) => {
    const softDeletedEntities = (0, steps_1.deleteStockLocationsStep)(input.ids);
    (0, remove_remote_links_1.removeRemoteLinkStep)(softDeletedEntities);
});
