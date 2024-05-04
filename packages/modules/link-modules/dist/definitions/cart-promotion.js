"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartPromotion = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
exports.CartPromotion = {
    serviceName: utils_1.LINKS.CartPromotion,
    isLink: true,
    databaseConfig: {
        tableName: "cart_promotion",
        idPrefix: "cartpromo",
    },
    alias: [
        {
            name: ["cart_promotion", "cart_promotions"],
            args: {
                entity: "LinkCartPromotion",
            },
        },
    ],
    primaryKeys: ["id", "cart_id", "promotion_id"],
    relationships: [
        {
            serviceName: modules_sdk_1.Modules.CART,
            primaryKey: "id",
            foreignKey: "cart_id",
            alias: "cart",
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
            serviceName: modules_sdk_1.Modules.CART,
            relationship: {
                serviceName: utils_1.LINKS.CartPromotion,
                primaryKey: "cart_id",
                foreignKey: "id",
                alias: "cart_link",
            },
        },
        {
            serviceName: modules_sdk_1.Modules.PROMOTION,
            relationship: {
                serviceName: utils_1.LINKS.CartPromotion,
                primaryKey: "promotion_id",
                foreignKey: "id",
                alias: "promotion_link",
            },
        },
    ],
};
