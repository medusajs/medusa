"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRegionsWorkflow = exports.updateRegionsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
const set_regions_payment_providers_1 = require("../steps/set-regions-payment-providers");
exports.updateRegionsWorkflowId = "update-regions";
exports.updateRegionsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.updateRegionsWorkflowId, (input) => {
    const data = (0, workflows_sdk_1.transform)(input, (data) => {
        const { selector, update } = data;
        const { payment_providers = [], ...rest } = update;
        return {
            selector,
            update: rest,
            payment_providers,
        };
    });
    const regions = (0, steps_1.updateRegionsStep)(data);
    const upsertProvidersNormalizedInput = (0, workflows_sdk_1.transform)({ data, regions }, (data) => {
        return data.regions.map((region) => {
            return {
                id: region.id,
                payment_providers: data.data.payment_providers,
            };
        });
    });
    (0, set_regions_payment_providers_1.setRegionsPaymentProvidersStep)({
        input: upsertProvidersNormalizedInput,
    });
    return regions;
});
