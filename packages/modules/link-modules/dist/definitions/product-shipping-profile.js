"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductShippingProfile = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
exports.ProductShippingProfile = {
    serviceName: utils_1.LINKS.ProductShippingProfile,
    isLink: true,
    databaseConfig: {
        tableName: "product_shipping_profile",
        idPrefix: "psprof",
    },
    alias: [
        {
            name: "product_shipping_profile",
            args: {
                entity: "LinkProductShippingProfile",
            },
        },
    ],
    primaryKeys: ["id", "product_id", "profile_id"],
    relationships: [
        {
            serviceName: modules_sdk_1.Modules.PRODUCT,
            primaryKey: "id",
            foreignKey: "product_id",
            alias: "product",
        },
        {
            serviceName: "shippingProfileService",
            isInternalService: true,
            primaryKey: "id",
            foreignKey: "profile_id",
            alias: "profile",
        },
    ],
    extends: [
        {
            serviceName: modules_sdk_1.Modules.PRODUCT,
            fieldAlias: {
                profile: "shipping_profile.profile",
            },
            relationship: {
                serviceName: utils_1.LINKS.ProductShippingProfile,
                primaryKey: "product_id",
                foreignKey: "id",
                alias: "shipping_profile",
            },
        },
        {
            serviceName: "shippingProfileService",
            relationship: {
                serviceName: utils_1.LINKS.ProductShippingProfile,
                isInternalService: true,
                primaryKey: "profile_id",
                foreignKey: "id",
                alias: "product_link",
            },
        },
    ],
};
