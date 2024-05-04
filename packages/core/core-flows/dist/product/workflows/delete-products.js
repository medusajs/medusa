"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductsWorkflow = exports.deleteProductsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const modules_sdk_1 = require("@medusajs/modules-sdk");
const delete_products_1 = require("../steps/delete-products");
const get_products_1 = require("../steps/get-products");
const common_1 = require("../../common");
exports.deleteProductsWorkflowId = "delete-products";
exports.deleteProductsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.deleteProductsWorkflowId, (input) => {
    const productsToDelete = (0, get_products_1.getProductsStep)({ ids: input.ids });
    const variantsToBeDeleted = (0, workflows_sdk_1.transform)({ productsToDelete }, (data) => {
        return data.productsToDelete
            .flatMap((product) => product.variants)
            .map((variant) => variant.id);
    });
    (0, common_1.removeRemoteLinkStep)({
        [modules_sdk_1.Modules.PRODUCT]: { variant_id: variantsToBeDeleted },
    }).config({ name: "remove-variant-link-step" });
    (0, common_1.removeRemoteLinkStep)({
        [modules_sdk_1.Modules.PRODUCT]: { product_id: input.ids },
    }).config({ name: "remove-product-link-step" });
    return (0, delete_products_1.deleteProductsStep)(input.ids);
});
