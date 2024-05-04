"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesChannelLocation = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
exports.SalesChannelLocation = {
    serviceName: utils_1.LINKS.SalesChannelLocation,
    isLink: true,
    databaseConfig: {
        tableName: "sales_channel_stock_location",
        idPrefix: "scloc",
    },
    alias: [
        {
            name: ["sales_channel_location", "sales_channel_locations"],
            args: {
                entity: "LinkSalesChannelLocation",
            },
        },
    ],
    primaryKeys: ["id", "sales_channel_id", "stock_location_id"],
    relationships: [
        {
            serviceName: modules_sdk_1.Modules.SALES_CHANNEL,
            primaryKey: "id",
            foreignKey: "sales_channel_id",
            alias: "sales_channel",
        },
        {
            serviceName: modules_sdk_1.Modules.STOCK_LOCATION,
            primaryKey: "id",
            foreignKey: "stock_location_id",
            alias: "location",
        },
    ],
    extends: [
        {
            serviceName: modules_sdk_1.Modules.SALES_CHANNEL,
            fieldAlias: {
                stock_locations: "locations_link.location",
            },
            relationship: {
                serviceName: utils_1.LINKS.SalesChannelLocation,
                primaryKey: "sales_channel_id",
                foreignKey: "id",
                alias: "locations_link",
                isList: true,
            },
        },
        {
            serviceName: modules_sdk_1.Modules.STOCK_LOCATION,
            fieldAlias: {
                sales_channels: "sales_channels_link.sales_channel",
            },
            relationship: {
                serviceName: utils_1.LINKS.SalesChannelLocation,
                primaryKey: "stock_location_id",
                foreignKey: "id",
                alias: "sales_channels_link",
                isList: true,
            },
        },
    ],
};
