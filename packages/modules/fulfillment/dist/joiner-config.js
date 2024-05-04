"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinerConfig = exports.entityNameToLinkableKeysMap = exports.LinkableKeys = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const _models_1 = require("./models");
exports.LinkableKeys = {
    fulfillment_id: _models_1.Fulfillment.name,
    fulfillment_set_id: _models_1.FulfillmentSet.name,
    shipping_option_id: _models_1.ShippingOption.name,
    shipping_option_rule_id: _models_1.ShippingOptionRule.name,
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
    serviceName: modules_sdk_1.Modules.FULFILLMENT,
    primaryKeys: ["id"],
    linkableKeys: exports.LinkableKeys,
    alias: [
        {
            name: ["fulfillment_set", "fulfillment_sets"],
            args: {
                entity: _models_1.FulfillmentSet.name,
            },
        },
        {
            name: ["shipping_option", "shipping_options"],
            args: {
                entity: _models_1.ShippingOption.name,
                methodSuffix: "ShippingOptions",
            },
        },
        {
            name: ["shipping_profile", "shipping_profiles"],
            args: {
                entity: _models_1.ShippingProfile.name,
                methodSuffix: "ShippingProfiles",
            },
        },
        {
            name: ["fulfillment", "fulfillments"],
            args: {
                entity: _models_1.Fulfillment.name,
                methodSuffix: "Fulfillments",
            },
        },
        {
            name: ["fulfillment_provider", "fulfillment_providers"],
            args: {
                entity: _models_1.FulfillmentProvider.name,
                methodSuffix: "FulfillmentProviders",
            },
        },
        {
            name: ["service_zone", "service_zones"],
            args: {
                entity: _models_1.ServiceZone.name,
                methodSuffix: "ServiceZones",
            },
        },
        {
            name: ["geo_zone", "geo_zones"],
            args: {
                entity: _models_1.GeoZone.name,
                methodSuffix: "GeoZones",
            },
        },
        {
            name: ["shipping_option_rule", "shipping_option_rules"],
            args: {
                entity: _models_1.ShippingOptionRule.name,
                methodSuffix: "ShippingOptionRules",
            },
        },
    ],
};
