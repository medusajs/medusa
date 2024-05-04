"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublishableApiKeySalesChannel = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
exports.PublishableApiKeySalesChannel = {
    serviceName: utils_1.LINKS.PublishableApiKeySalesChannel,
    isLink: true,
    databaseConfig: {
        tableName: "publishable_api_key_sales_channel",
        idPrefix: "pksc",
    },
    alias: [
        {
            name: [
                "publishable_api_key_sales_channel",
                "publishable_api_key_sales_channels",
            ],
        },
    ],
    primaryKeys: ["id", "publishable_key_id", "sales_channel_id"],
    relationships: [
        {
            serviceName: modules_sdk_1.Modules.API_KEY,
            primaryKey: "id",
            foreignKey: "publishable_key_id",
            alias: "api_key",
        },
        {
            serviceName: modules_sdk_1.Modules.SALES_CHANNEL,
            primaryKey: "id",
            foreignKey: "sales_channel_id",
            alias: "sales_channel",
        },
    ],
    extends: [
        {
            serviceName: modules_sdk_1.Modules.API_KEY,
            fieldAlias: {
                sales_channels: "sales_channels_link.sales_channel",
            },
            relationship: {
                serviceName: utils_1.LINKS.PublishableApiKeySalesChannel,
                primaryKey: "publishable_key_id",
                foreignKey: "id",
                alias: "sales_channels_link",
                isList: true,
            },
        },
        {
            serviceName: modules_sdk_1.Modules.SALES_CHANNEL,
            fieldAlias: {
                publishable_api_keys: "api_keys_link.api_key",
            },
            relationship: {
                serviceName: utils_1.LINKS.PublishableApiKeySalesChannel,
                primaryKey: "sales_channel_id",
                foreignKey: "id",
                alias: "api_keys_link",
                isList: true,
            },
        },
    ],
};
