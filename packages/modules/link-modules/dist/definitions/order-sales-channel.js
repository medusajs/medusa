"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSalesChannel = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
exports.OrderSalesChannel = {
    serviceName: utils_1.LINKS.OrderSalesChannel,
    isLink: true,
    databaseConfig: {
        tableName: "order_sales_channel",
        idPrefix: "ordersc",
    },
    alias: [
        {
            name: "order_sales_channel",
        },
        {
            name: "order_sales_channels",
        },
    ],
    primaryKeys: ["id", "order_id", "sales_channel_id"],
    relationships: [
        {
            serviceName: modules_sdk_1.Modules.ORDER,
            isInternalService: true,
            primaryKey: "id",
            foreignKey: "order_id",
            alias: "order",
        },
        {
            serviceName: "salesChannelService",
            isInternalService: true,
            primaryKey: "id",
            foreignKey: "sales_channel_id",
            alias: "sales_channel",
        },
    ],
    extends: [
        {
            serviceName: modules_sdk_1.Modules.ORDER,
            fieldAlias: {
                sales_channel: "sales_channel_link.sales_channel",
            },
            relationship: {
                serviceName: utils_1.LINKS.OrderSalesChannel,
                isInternalService: true,
                primaryKey: "order_id",
                foreignKey: "id",
                alias: "sales_channel_link",
            },
        },
        {
            serviceName: "salesChannelService",
            fieldAlias: {
                orders: "order_link.order",
            },
            relationship: {
                serviceName: utils_1.LINKS.OrderSalesChannel,
                isInternalService: true,
                primaryKey: "sales_channel_id",
                foreignKey: "id",
                alias: "order_link",
                isList: true,
            },
        },
    ],
};
