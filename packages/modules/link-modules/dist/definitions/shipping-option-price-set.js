"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingOptionPriceSet = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
exports.ShippingOptionPriceSet = {
    serviceName: utils_1.LINKS.ShippingOptionPriceSet,
    isLink: true,
    databaseConfig: {
        tableName: "shipping_option_price_set",
        idPrefix: "sops",
    },
    alias: [
        {
            name: ["shipping_option_price_set", "shipping_option_price_sets"],
            args: {
                entity: "LinkShippingOptionPriceSet",
            },
        },
    ],
    primaryKeys: ["id", "shipping_option_id", "price_set_id"],
    relationships: [
        {
            serviceName: modules_sdk_1.Modules.FULFILLMENT,
            primaryKey: "id",
            foreignKey: "shipping_option_id",
            alias: "shipping_option",
            args: {
                methodSuffix: "ShippingOptions",
            },
        },
        {
            serviceName: modules_sdk_1.Modules.PRICING,
            primaryKey: "id",
            foreignKey: "price_set_id",
            alias: "price_set",
            deleteCascade: true,
        },
    ],
    extends: [
        {
            serviceName: modules_sdk_1.Modules.FULFILLMENT,
            fieldAlias: {
                prices: {
                    path: "price_set_link.price_set.prices",
                    isList: true,
                },
                calculated_price: {
                    path: "price_set_link.price_set.calculated_price",
                    forwardArgumentsOnPath: ["price_set_link.price_set"],
                },
            },
            relationship: {
                serviceName: utils_1.LINKS.ShippingOptionPriceSet,
                primaryKey: "shipping_option_id",
                foreignKey: "id",
                alias: "price_set_link",
            },
        },
        {
            serviceName: modules_sdk_1.Modules.PRICING,
            relationship: {
                serviceName: utils_1.LINKS.ShippingOptionPriceSet,
                primaryKey: "price_set_id",
                foreignKey: "id",
                alias: "shipping_option_link",
            },
            fieldAlias: {
                shipping_option: "shipping_option_link.shipping_option",
            },
        },
    ],
};
