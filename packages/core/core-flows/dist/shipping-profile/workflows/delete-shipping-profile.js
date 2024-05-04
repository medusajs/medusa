"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteShippingProfileWorkflow = exports.deleteShippingProfileWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
const steps_1 = require("../steps");
const common_1 = require("../../common");
exports.deleteShippingProfileWorkflowId = "delete-shipping-profile-workflow";
exports.deleteShippingProfileWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deleteShippingProfileWorkflowId, (input) => {
    (0, steps_1.deleteShippingProfilesStep)(input.ids);
    (0, common_1.removeRemoteLinkStep)({
        [modules_sdk_1.Modules.FULFILLMENT]: { shipping_profile_id: input.ids },
    });
});
