"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartProduct = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.CartProduct = {
    isLink: true,
    isReadOnlyLink: true,
    extends: [
        {
            serviceName: modules_sdk_1.Modules.CART,
            relationship: {
                serviceName: modules_sdk_1.Modules.PRODUCT,
                primaryKey: "id",
                foreignKey: "items.product_id",
                alias: "product",
            },
        },
        {
            serviceName: modules_sdk_1.Modules.CART,
            relationship: {
                serviceName: modules_sdk_1.Modules.PRODUCT,
                primaryKey: "id",
                foreignKey: "items.variant_id",
                alias: "variant",
                args: {
                    methodSuffix: "Variants",
                },
            },
        },
        {
            serviceName: modules_sdk_1.Modules.PRODUCT,
            relationship: {
                serviceName: modules_sdk_1.Modules.CART,
                primaryKey: "variant_id",
                foreignKey: "id",
                alias: "cart_items",
                isList: true,
                args: {
                    methodSuffix: "LineItems",
                },
            },
        },
    ],
};
