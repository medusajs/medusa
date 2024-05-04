"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePromotionsWorkflow = exports.deletePromotionsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.deletePromotionsWorkflowId = "delete-promotions";
exports.deletePromotionsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deletePromotionsWorkflowId, (input) => {
    return (0, steps_1.deletePromotionsStep)(input.ids);
});
