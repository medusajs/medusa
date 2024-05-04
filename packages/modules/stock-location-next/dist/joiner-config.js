"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinerConfig = exports.entityNameToLinkableKeysMap = exports.LinkableKeys = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const models_1 = require("./models");
const schema_1 = __importDefault(require("./schema"));
exports.LinkableKeys = {
    stock_location_id: models_1.StockLocation.name,
    location_id: models_1.StockLocation.name,
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
    serviceName: modules_sdk_1.Modules.STOCK_LOCATION,
    primaryKeys: ["id"],
    linkableKeys: exports.LinkableKeys,
    schema: schema_1.default,
    alias: [
        {
            name: ["stock_location", "stock_locations"],
            args: {
                entity: "StockLocation",
            },
        },
    ],
};
