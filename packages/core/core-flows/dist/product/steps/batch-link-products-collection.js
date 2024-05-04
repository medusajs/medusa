"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchLinkProductsToCollectionStep = exports.batchLinkProductsToCollectionStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
exports.batchLinkProductsToCollectionStepId = "batch-link-products-to-collection";
exports.batchLinkProductsToCollectionStep = (0, workflows_sdk_1.createStep)(exports.batchLinkProductsToCollectionStepId, async (data, { container }) => {
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    if (!data.add?.length && !data.remove?.length) {
        return new workflows_sdk_1.StepResponse(void 0, null);
    }
    const dbCollection = await service.retrieveCollection(data.id, {
        take: null,
        select: ["id", "products.id"],
        relations: ["products"],
    });
    const existingProductIds = dbCollection.products?.map((p) => p.id) ?? [];
    const toRemoveMap = new Map(data.remove?.map((id) => [id, true]) ?? []);
    const newProductIds = [
        ...existingProductIds.filter((id) => !toRemoveMap.has(id)),
        ...(data.add ?? []),
    ];
    await service.updateCollections(data.id, {
        product_ids: newProductIds,
    });
    return new workflows_sdk_1.StepResponse(void 0, {
        id: data.id,
        productIds: existingProductIds,
    });
}, async (prevData, { container }) => {
    if (!prevData) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.PRODUCT);
    await service.updateCollections(prevData.id, {
        product_ids: prevData.productIds,
    });
});
