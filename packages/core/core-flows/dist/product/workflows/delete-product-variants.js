"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductVariantsWorkflow = exports.deleteProductVariantsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
const steps_1 = require("../steps");
const common_1 = require("../../common");
exports.deleteProductVariantsWorkflowId = "delete-product-variants";
exports.deleteProductVariantsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deleteProductVariantsWorkflowId, (input) => {
    (0, common_1.removeRemoteLinkStep)({
        [modules_sdk_1.Modules.PRODUCT]: { variant_id: input.ids },
    }).config({ name: "remove-variant-link-step" });
    return (0, steps_1.deleteProductVariantsStep)(input.ids);
});
