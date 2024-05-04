"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderPromotion = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
exports.OrderPromotion = {
    serviceName: utils_1.LINKS.OrderPromotion,
    isLink: true,
    databaseConfig: {
        tableName: "order_promotion",
        idPrefix: "orderpromo",
    },
    alias: [
        {
            name: ["order_promotion", "order_promotions"],
            args: {
                entity: "LinkOrderPromotion",
            },
        },
    ],
    primaryKeys: ["id", "order_id", "promotion_id"],
    relationships: [
        {
            serviceName: modules_sdk_1.Modules.ORDER,
            primaryKey: "id",
            foreignKey: "order_id",
            alias: "order",
        },
        {
            serviceName: modules_sdk_1.Modules.PROMOTION,
            primaryKey: "id",
            foreignKey: "promotion_id",
            alias: "promotion",
        },
    ],
    extends: [
        {
            serviceName: modules_sdk_1.Modules.ORDER,
            relationship: {
                serviceName: utils_1.LINKS.OrderPromotion,
                primaryKey: "order_id",
                foreignKey: "id",
                alias: "order_link",
            },
        },
        {
            serviceName: modules_sdk_1.Modules.PROMOTION,
            relationship: {
                serviceName: utils_1.LINKS.OrderPromotion,
                primaryKey: "promotion_id",
                foreignKey: "id",
                alias: "promotion_link",
            },
        },
    ],
};
