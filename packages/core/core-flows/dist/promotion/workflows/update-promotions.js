"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePromotionsWorkflow = exports.updatePromotionsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.updatePromotionsWorkflowId = "update-promotions";
exports.updatePromotionsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updatePromotionsWorkflowId, (input) => {
    return (0, steps_1.updatePromotionsStep)(input.promotionsData);
});
