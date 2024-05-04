"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPromotionsWorkflow = exports.createPromotionsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createPromotionsWorkflowId = "create-promotions";
exports.createPromotionsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createPromotionsWorkflowId, (input) => {
    return (0, steps_1.createPromotionsStep)(input.promotionsData);
});
