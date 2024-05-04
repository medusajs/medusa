"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultStoreStep = exports.createDefaultStoreStepId = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const store_1 = require("../../store");
exports.createDefaultStoreStepId = "create-default-store";
exports.createDefaultStoreStep = (0, workflows_sdk_1.createStep)(exports.createDefaultStoreStepId, async (data, { container }) => {
    const storeService = container.resolve(modules_sdk_1.ModuleRegistrationName.STORE);
    let shouldDelete = false;
    let [store] = await storeService.list({}, { take: 1 });
    if (!store) {
        store = await (0, store_1.createStoresWorkflow)(container).run({
            input: {
                stores: [
                    {
                        // TODO: Revisit for a more sophisticated approach
                        ...data.store,
                        supported_currency_codes: ["usd"],
                        default_currency_code: "usd",
                    },
                ],
            },
        });
        shouldDelete = true;
    }
    return new workflows_sdk_1.StepResponse(store, { storeId: store.id, shouldDelete });
}, async (data, { container }) => {
    if (!data || !data.shouldDelete) {
        return;
    }
    const service = container.resolve(modules_sdk_1.ModuleRegistrationName.STORE);
    await service.delete(data.storeId);
});
