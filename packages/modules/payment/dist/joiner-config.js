"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinerConfig = exports.entityNameToLinkableKeysMap = exports.LinkableKeys = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const _models_1 = require("./models");
exports.LinkableKeys = {
    payment_id: _models_1.Payment.name,
    payment_collection_id: _models_1.PaymentCollection.name,
    payment_provider_id: _models_1.PaymentProvider.name,
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
    serviceName: modules_sdk_1.Modules.PAYMENT,
    primaryKeys: ["id"],
    linkableKeys: exports.LinkableKeys,
    alias: [
        {
            name: ["payment", "payments"],
            args: {
                entity: _models_1.Payment.name,
                methodSuffix: "Payments",
            },
        },
        {
            name: ["payment_collection", "payment_collections"],
            args: {
                entity: _models_1.PaymentCollection.name,
            },
        },
        {
            name: ["payment_session", "payment_sessions"],
            args: {
                entity: _models_1.PaymentSession.name,
                methodSuffix: "PaymentSessions",
            },
        },
        {
            name: ["payment_provider", "payment_providers"],
            args: {
                entity: _models_1.PaymentProvider.name,
                methodSuffix: "PaymentProviders",
            },
        },
    ],
};
