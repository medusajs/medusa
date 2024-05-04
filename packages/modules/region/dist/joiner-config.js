"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinerConfig = exports.entityNameToLinkableKeysMap = exports.LinkableKeys = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const _models_1 = require("./models");
exports.LinkableKeys = {
    region_id: _models_1.Region.name,
    country_iso: _models_1.Country.name,
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
    serviceName: modules_sdk_1.Modules.REGION,
    primaryKeys: ["id"],
    linkableKeys: exports.LinkableKeys,
    alias: [
        {
            name: ["region", "regions"],
            args: { entity: _models_1.Region.name },
        },
        {
            name: ["country", "countries"],
            args: { entity: _models_1.Country.name, methodSuffix: "Countries" },
        },
    ],
};
