"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCampaignsWorkflow = exports.updateCampaignsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.updateCampaignsWorkflowId = "update-campaigns";
exports.updateCampaignsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateCampaignsWorkflowId, (input) => {
    return (0, steps_1.updateCampaignsStep)(input.campaignsData);
});
