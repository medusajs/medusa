"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSalesChannel = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
exports.ProductSalesChannel = {
    serviceName: utils_1.LINKS.ProductSalesChannel,
    isLink: true,
    databaseConfig: {
        tableName: "product_sales_channel",
        idPrefix: "prodsc",
    },
    alias: [
        {
            name: "product_sales_channel",
        },
        {
            name: "product_sales_channels",
        },
    ],
    primaryKeys: ["id", "product_id", "sales_channel_id"],
    relationships: [
        {
            serviceName: modules_sdk_1.Modules.PRODUCT,
            primaryKey: "id",
            foreignKey: "product_id",
            alias: "product",
        },
        {
            serviceName: modules_sdk_1.Modules.SALES_CHANNEL,
            isInternalService: true,
            primaryKey: "id",
            foreignKey: "sales_channel_id",
            alias: "sales_channel",
        },
    ],
    extends: [
        {
            serviceName: modules_sdk_1.Modules.PRODUCT,
            fieldAlias: {
                sales_channels: "sales_channels_link.sales_channel",
            },
            relationship: {
                serviceName: utils_1.LINKS.ProductSalesChannel,
                primaryKey: "product_id",
                foreignKey: "id",
                alias: "sales_channels_link",
                isList: true,
            },
        },
        {
            serviceName: modules_sdk_1.Modules.SALES_CHANNEL,
            relationship: {
                serviceName: utils_1.LINKS.ProductSalesChannel,
                isInternalService: true,
                primaryKey: "sales_channel_id",
                foreignKey: "id",
                alias: "products_link",
                isList: true,
            },
        },
    ],
};
