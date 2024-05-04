"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinerConfig = exports.entityNameToLinkableKeysMap = exports.LinkableKeys = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const _models_1 = require("./models");
exports.LinkableKeys = {
    customer_id: _models_1.Customer.name,
    customer_group_id: _models_1.CustomerGroup.name,
    customer_address_id: _models_1.Address.name,
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
    serviceName: modules_sdk_1.Modules.CUSTOMER,
    primaryKeys: ["id"],
    linkableKeys: exports.LinkableKeys,
    alias: [
        {
            name: ["customer", "customers"],
            args: {
                entity: _models_1.Customer.name,
            },
        },
        {
            name: ["customer_group", "customer_groups"],
            args: {
                entity: _models_1.CustomerGroup.name,
                methodSuffix: "CustomerGroups",
            },
        },
        {
            name: ["customer_address", "customer_addresses"],
            args: {
                entity: _models_1.Address.name,
                methodSuffix: "Addresses",
            },
        },
    ],
};
