"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinerConfig = exports.entityNameToLinkableKeysMap = exports.LinkableKeys = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const _models_1 = require("./models");
exports.LinkableKeys = {
    tax_rate_id: _models_1.TaxRate.name,
    tax_region_id: _models_1.TaxRegion.name,
    tax_rate_rule_id: _models_1.TaxRateRule.name,
    tax_provider_id: _models_1.TaxProvider.name,
};
const entityLinkableKeysMap = {};
Object.entries(exports.LinkableKeys).forEach(([key, value]) => {
    entityLinkableKeysMap[value] ?? (entityLinkableKeysMap[value] = []);
    entityLinkableKeysMap[value].push({
        mapTo: key,
        valueFrom: key.split("_").pop(),
    });
});
exports.entityNameToLinkableKeysMap = entityLinkableKeysMap;
exports.joinerConfig = {
    serviceName: modules_sdk_1.Modules.TAX,
    primaryKeys: ["id"],
    linkableKeys: exports.LinkableKeys,
    alias: [
        {
            name: ["tax_rate", "tax_rates"],
            args: {
                entity: _models_1.TaxRate.name,
            },
        },
        {
            name: ["tax_region", "tax_regions"],
            args: {
                entity: _models_1.TaxRegion.name,
                methodSuffix: "TaxRegions",
            },
        },
        {
            name: ["tax_rate_rule", "tax_rate_rules"],
            args: {
                entity: _models_1.TaxRateRule.name,
                methodSuffix: "TaxRateRules",
            },
        },
        {
            name: ["tax_provider", "tax_providers"],
            args: {
                entity: _models_1.TaxProvider.name,
                methodSuffix: "TaxProviders",
            },
        },
    ],
};
