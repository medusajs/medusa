"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductVariants = exports.workflowSteps = exports.UpdateProductVariantsActions = void 0;
const orchestration_1 = require("@medusajs/orchestration");
const definitions_1 = require("../../definitions");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const handlers_1 = require("../../handlers");
var UpdateProductVariantsActions;
(function (UpdateProductVariantsActions) {
    UpdateProductVariantsActions["prepare"] = "prepare";
    UpdateProductVariantsActions["updateProductVariants"] = "updateProductVariants";
    UpdateProductVariantsActions["revertProductVariantsUpdate"] = "revertProductVariantsUpdate";
    UpdateProductVariantsActions["upsertPrices"] = "upsertPrices";
})(UpdateProductVariantsActions || (exports.UpdateProductVariantsActions = UpdateProductVariantsActions = {}));
exports.workflowSteps = {
    next: {
        action: UpdateProductVariantsActions.prepare,
        noCompensation: true,
        next: {
            action: UpdateProductVariantsActions.updateProductVariants,
            noCompensation: true,
            next: [
                {
                    action: UpdateProductVariantsActions.upsertPrices,
                },
            ],
        },
    },
};
const handlers = new Map([
    [
        UpdateProductVariantsActions.prepare,
        {
            invoke: (0, workflows_sdk_1.pipe)({
                merge: true,
                inputAlias: definitions_1.InputAlias.ProductVariantsUpdateInputData,
                invoke: {
                    from: definitions_1.InputAlias.ProductVariantsUpdateInputData,
                },
            }, handlers_1.ProductHandlers.updateProductVariantsPrepareData),
        },
    ],
    [
        UpdateProductVariantsActions.updateProductVariants,
        {
            invoke: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: {
                    from: UpdateProductVariantsActions.prepare,
                },
            }, handlers_1.ProductHandlers.updateProductVariants),
        },
    ],
    [
        UpdateProductVariantsActions.upsertPrices,
        {
            invoke: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: [
                    {
                        from: UpdateProductVariantsActions.prepare,
                    },
                ],
            }, handlers_1.ProductHandlers.upsertVariantPrices),
            compensate: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: [
                    {
                        from: UpdateProductVariantsActions.prepare,
                    },
                    {
                        from: UpdateProductVariantsActions.upsertPrices,
                    },
                ],
            }, handlers_1.ProductHandlers.revertVariantPrices),
        },
    ],
]);
orchestration_1.WorkflowManager.register(definitions_1.Workflows.UpdateProductVariants, exports.workflowSteps, handlers);
exports.updateProductVariants = (0, workflows_sdk_1.exportWorkflow)(definitions_1.Workflows.UpdateProductVariants, UpdateProductVariantsActions.updateProductVariants);
