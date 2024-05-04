"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRegionsWorkflow = exports.createRegionsWorkflowId = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
const set_regions_payment_providers_1 = require("../steps/set-regions-payment-providers");
exports.createRegionsWorkflowId = "create-regions";
exports.createRegionsWorkflow = (0, workflows_sdk_1.createWorkflow)(exports.createRegionsWorkflowId, (input) => {
    const data = (0, workflows_sdk_1.transform)(input, (data) => {
        const regionIndexToPaymentProviders = data.regions.map((region, index) => {
            return {
                region_index: index,
                payment_providers: region.payment_providers,
            };
        });
        return {
            regions: data.regions,
            regionIndexToPaymentProviders,
        };
    });
    const regions = (0, steps_1.createRegionsStep)(data.regions);
    const normalizedRegionProviderData = (0, workflows_sdk_1.transform)({
        regionIndexToPaymentProviders: data.regionIndexToPaymentProviders,
        regions,
    }, (data) => {
        return data.regionIndexToPaymentProviders.map(({ region_index, payment_providers }) => {
            return {
                id: data.regions[region_index].id,
                payment_providers,
            };
        });
    });
    (0, set_regions_payment_providers_1.setRegionsPaymentProvidersStep)({
        input: normalizedRegionProviderData,
    });
    return regions;
});
