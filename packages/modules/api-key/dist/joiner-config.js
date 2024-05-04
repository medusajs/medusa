"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinerConfig = exports.entityNameToLinkableKeysMap = exports.LinkableKeys = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const api_key_1 = __importDefault(require("./models/api-key"));
exports.LinkableKeys = {
    api_key_id: api_key_1.default.name,
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
    serviceName: modules_sdk_1.Modules.API_KEY,
    primaryKeys: ["id"],
    linkableKeys: exports.LinkableKeys,
    alias: [
        {
            name: ["api_key", "api_keys"],
            args: { entity: api_key_1.default.name },
        },
    ],
};
