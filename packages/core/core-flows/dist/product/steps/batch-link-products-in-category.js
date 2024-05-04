"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchLinkProductsToCategoryStep = exports.batchLinkProductsToCategoryStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.batchLinkProductsToCategoryStepId = "batch-link-products-to-category";
exports.batchLinkProductsToCategoryStep = (0, workflows_sdk_1.createStep)(exports.batchLinkProductsToCategoryStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    if (!data.add?.length && !data.remove?.length) {
        return new workflows_sdk_1.StepResponse(void 0, null);
    }
    const toRemoveSet = new Set(data.remove?.map((id) => id));
    const dbProducts = await service.list({ id: [...(data.add ?? []), ...(data.remove ?? [])] }, {
        take: null,
        select: ["id", "categories"],
    });
    const productsWithUpdatedCategories = dbProducts.map((p) => {
        if (toRemoveSet.has(p.id)) {
            return {
                id: p.id,
                category_ids: (p.categories ?? [])
                    .filter((c) => c.id !== data.id)
                    .map((c) => c.id),
            };
        }
        return {
            id: p.id,
            category_ids: [...(p.categories ?? []).map((c) => c.id), data.id],
        };
    });
    await service.upsert(productsWithUpdatedCategories);
    return new workflows_sdk_1.StepResponse(void 0, {
        id: data.id,
        remove: data.remove,
        add: data.add,
        productIds: productsWithUpdatedCategories.map((p) => p.id),
    });
}, async (prevData, { container }) => {
    if (!prevData) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    const dbProducts = await service.list({ id: prevData.productIds }, {
        take: null,
        select: ["id", "categories"],
    });
    const toRemoveSet = new Set(prevData.remove?.map((id) => id));
    const productsWithRevertedCategories = dbProducts.map((p) => {
        if (toRemoveSet.has(p.id)) {
            return {
                id: p.id,
                category_ids: [...(p.categories ?? []).map((c) => c.id), prevData.id],
            };
        }
        return {
            id: p.id,
            category_ids: (p.categories ?? [])
                .filter((c) => c.id !== prevData.id)
                .map((c) => c.id),
        };
    });
    await service.upsert(productsWithRevertedCategories);
});
