"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/utils");
const medusa_core_utils_1 = require("medusa-core-utils");
const _models_1 = require("../models");
// TODO rework DTO's
class FulfillmentProviderService extends utils_1.ModulesSdkUtils.internalModuleServiceFactory(_models_1.FulfillmentProvider) {
    constructor(container) {
        super(container);
        this.fulfillmentProviderRepository_ =
            container.fulfillmentProviderRepository;
    }
    static getRegistrationIdentifier(providerClass, optionName) {
        return `${providerClass.identifier}_${optionName}`;
    }
    retrieveProviderRegistration(providerId) {
        try {
            return this.__container__[`fp_${providerId}`];
        }
        catch (err) {
            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_FOUND, `Could not find a fulfillment provider with id: ${providerId}`);
        }
    }
    async listFulfillmentOptions(providerIds) {
        return await (0, utils_1.promiseAll)(providerIds.map(async (p) => {
            const provider = this.retrieveProviderRegistration(p);
            return {
                provider_id: p,
                options: (await provider.getFulfillmentOptions()),
            };
        }));
    }
    async getFulfillmentOptions(providerId) {
        const provider = this.retrieveProviderRegistration(providerId);
        return await provider.getFulfillmentOptions();
    }
    async validateFulfillmentData(providerId, optionData, data, context) {
        const provider = this.retrieveProviderRegistration(providerId);
        return await provider.validateFulfillmentData(optionData, data, context);
    }
    async validateOption(providerId, data) {
        const provider = this.retrieveProviderRegistration(providerId);
        return await provider.validateOption(data);
    }
    async createFulfillment(providerId, data, items, order, fulfillment) {
        const provider = this.retrieveProviderRegistration(providerId);
        return await provider.createFulfillment(data, items, order, fulfillment);
    }
    async cancelFulfillment(providerId, fulfillment) {
        const provider = this.retrieveProviderRegistration(providerId);
        return await provider.cancelFulfillment(fulfillment);
    }
}
exports.default = FulfillmentProviderService;
