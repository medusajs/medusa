"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCampaignsWorkflow = exports.createCampaignsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createCampaignsWorkflowId = "create-campaigns";
exports.createCampaignsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createCampaignsWorkflowId, (input) => {
    return (0, steps_1.createCampaignsStep)(input.campaignsData);
});
