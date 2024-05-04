"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartPaymentCollection = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
exports.CartPaymentCollection = {
    serviceName: utils_1.LINKS.CartPaymentCollection,
    isLink: true,
    databaseConfig: {
        tableName: "cart_payment_collection",
        idPrefix: "capaycol",
    },
    alias: [
        {
            name: ["cart_payment_collection", "cart_payment_collections"],
            args: {
                entity: "LinkCartPaymentCollection",
            },
        },
    ],
    primaryKeys: ["id", "cart_id", "payment_collection_id"],
    relationships: [
        {
            serviceName: modules_sdk_1.Modules.CART,
            primaryKey: "id",
            foreignKey: "cart_id",
            alias: "cart",
        },
        {
            serviceName: modules_sdk_1.Modules.PAYMENT,
            primaryKey: "id",
            foreignKey: "payment_collection_id",
            alias: "payment_collection",
        },
    ],
    extends: [
        {
            serviceName: modules_sdk_1.Modules.CART,
            fieldAlias: {
                payment_collection: "payment_collection_link.payment_collection",
            },
            relationship: {
                serviceName: utils_1.LINKS.CartPaymentCollection,
                primaryKey: "cart_id",
                foreignKey: "id",
                alias: "payment_collection_link",
            },
        },
        {
            serviceName: modules_sdk_1.Modules.PAYMENT,
            fieldAlias: {
                cart: "cart_link.cart",
            },
            relationship: {
                serviceName: utils_1.LINKS.CartPaymentCollection,
                primaryKey: "payment_collection_id",
                foreignKey: "id",
                alias: "cart_link",
            },
        },
    ],
};
