"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShippingProfilesWorkflow = exports.createShippingProfilesWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.createShippingProfilesWorkflowId = "create-shipping-profiles-workflow";
exports.createShippingProfilesWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createShippingProfilesWorkflowId, (input) => {
    const shippingProfiles = (0, steps_1.createShippingProfilesStep)(input.data);
    return shippingProfiles;
});
