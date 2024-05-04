"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductVariants = exports.workflowSteps = exports.CreateProductVariantsActions = void 0;
const orchestration_1 = require("@medusajs/orchestration");
const definitions_1 = require("../../definitions");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const handlers_1 = require("../../handlers");
var CreateProductVariantsActions;
(function (CreateProductVariantsActions) {
    CreateProductVariantsActions["prepare"] = "prepare";
    CreateProductVariantsActions["createProductVariants"] = "createProductVariants";
    CreateProductVariantsActions["revertProductVariantsCreate"] = "revertProductVariantsCreate";
    CreateProductVariantsActions["upsertPrices"] = "upsertPrices";
})(CreateProductVariantsActions || (exports.CreateProductVariantsActions = CreateProductVariantsActions = {}));
exports.workflowSteps = {
    next: {
        action: CreateProductVariantsActions.prepare,
        noCompensation: true,
        next: {
            action: CreateProductVariantsActions.createProductVariants,
            next: [
                {
                    action: CreateProductVariantsActions.upsertPrices,
                },
            ],
        },
    },
};
const handlers = new Map([
    [
        CreateProductVariantsActions.prepare,
        {
            invoke: (0, workflows_sdk_1.pipe)({
                merge: true,
                inputAlias: definitions_1.InputAlias.ProductVariantsCreateInputData,
                invoke: {
                    from: definitions_1.InputAlias.ProductVariantsCreateInputData,
                },
            }, handlers_1.ProductHandlers.createProductVariantsPrepareData),
        },
    ],
    [
        CreateProductVariantsActions.createProductVariants,
        {
            invoke: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: {
                    from: CreateProductVariantsActions.prepare,
                },
            }, handlers_1.ProductHandlers.createProductVariants),
            compensate: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: [
                    {
                        from: CreateProductVariantsActions.prepare,
                    },
                    {
                        from: CreateProductVariantsActions.createProductVariants,
                    },
                ],
            }, handlers_1.ProductHandlers.removeProductVariants),
        },
    ],
    [
        CreateProductVariantsActions.upsertPrices,
        {
            invoke: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: [
                    {
                        from: CreateProductVariantsActions.createProductVariants,
                    },
                ],
            }, handlers_1.ProductHandlers.upsertVariantPrices),
            compensate: (0, workflows_sdk_1.pipe)({
                merge: true,
                invoke: [
                    {
                        from: CreateProductVariantsActions.prepare,
                    },
                    {
                        from: CreateProductVariantsActions.upsertPrices,
                    },
                ],
            }, handlers_1.ProductHandlers.revertVariantPrices),
        },
    ],
]);
orchestration_1.WorkflowManager.register(definitions_1.Workflows.CreateProductVariants, exports.workflowSteps, handlers);
exports.createProductVariants = (0, workflows_sdk_1.exportWorkflow)(definitions_1.Workflows.CreateProductVariants, CreateProductVariantsActions.createProductVariants);
