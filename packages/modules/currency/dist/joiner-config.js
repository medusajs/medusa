"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinerConfig = exports.entityNameToLinkableKeysMap = exports.LinkableKeys = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const currency_1 = __importDefault(require("./models/currency"));
exports.LinkableKeys = {
    code: currency_1.default.name,
    currency_code: currency_1.default.name,
    default_currency_code: currency_1.default.name,
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
    serviceName: modules_sdk_1.Modules.CURRENCY,
    primaryKeys: ["code"],
    linkableKeys: exports.LinkableKeys,
    alias: [
        {
            name: ["currency", "currencies"],
            args: { entity: currency_1.default.name },
        },
    ],
};
