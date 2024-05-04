"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCampaignsWorkflow = exports.deleteCampaignsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.deleteCampaignsWorkflowId = "delete-campaigns";
exports.deleteCampaignsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deleteCampaignsWorkflowId, (input) => {
    return (0, steps_1.deleteCampaignsStep)(input.ids);
});
