"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinerConfig = exports.entityNameToLinkableKeysMap = exports.LinkableKeys = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const _models_1 = require("./models");
const schema_1 = __importDefault(require("./schema"));
exports.LinkableKeys = {
    price_set_id: _models_1.PriceSet.name,
    price_list_id: _models_1.PriceList.name,
    price_id: _models_1.Price.name,
    rule_type_id: _models_1.RuleType.name,
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
    serviceName: modules_sdk_1.Modules.PRICING,
    primaryKeys: ["id"],
    linkableKeys: exports.LinkableKeys,
    schema: schema_1.default,
    alias: [
        {
            name: ["price_set", "price_sets"],
            args: {
                entity: "PriceSet",
            },
        },
        {
            name: ["price_list", "price_lists"],
            args: {
                methodSuffix: "PriceLists",
            },
        },
        {
            name: ["price", "prices"],
            args: {
                methodSuffix: "Prices",
            },
        },
        {
            name: ["rule_type", "rule_types"],
            args: {
                methodSuffix: "RuleTypes",
            },
        },
    ],
};
