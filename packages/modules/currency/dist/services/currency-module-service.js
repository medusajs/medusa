"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/utils");
const _models_1 = require("../models");
const joiner_config_1 = require("../joiner-config");
const generateMethodForModels = [];
class CurrencyModuleService extends utils_1.ModulesSdkUtils.abstractModuleServiceFactory(_models_1.Currency, generateMethodForModels, joiner_config_1.entityNameToLinkableKeysMap) {
    constructor({ baseRepository, currencyService }, moduleDeclaration) {
        // @ts-ignore
        super(...arguments);
        this.moduleDeclaration = moduleDeclaration;
        this.baseRepository_ = baseRepository;
        this.currencyService_ = currencyService;
    }
    __joinerConfig() {
        return joiner_config_1.joinerConfig;
    }
    retrieve(code, config, sharedContext) {
        return this.currencyService_.retrieve(code?.toLowerCase(), config, sharedContext);
    }
    list(filters, config, sharedContext) {
        return this.currencyService_.list(CurrencyModuleService.normalizeFilters(filters), config, sharedContext);
    }
    listAndCount(filters, config, sharedContext) {
        return this.currencyService_.listAndCount(CurrencyModuleService.normalizeFilters(filters), config, sharedContext);
    }
    static normalizeFilters(filters) {
        return normalizeFilterable(filters, (fieldName, value) => {
            if (fieldName === "code" && !!value) {
                return value.toLowerCase();
            }
            return value;
        });
    }
}
exports.default = CurrencyModuleService;
// TODO: Move normalizer support to `buildQuery` so we don't even need to override the list/retrieve methods just for normalization
const normalizeFilterable = (filters, normalizer) => {
    if (!filters) {
        return filters;
    }
    const normalizedFilters = {};
    for (const key in filters) {
        if (key === "$and" || key === "$or") {
            normalizedFilters[key] = filters[key].map((filter) => normalizeFilterable(filter, normalizer));
        }
        else if (filters[key] !== undefined) {
            if (Array.isArray(filters[key])) {
                normalizedFilters[key] = filters[key].map((val) => normalizer(key, val));
            }
            else {
                normalizedFilters[key] = normalizer(key, filters[key]);
            }
        }
    }
    return normalizedFilters;
};
