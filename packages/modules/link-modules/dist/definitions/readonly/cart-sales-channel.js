"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartSalesChannel = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.CartSalesChannel = {
    isLink: true,
    isReadOnlyLink: true,
    extends: [
        {
            serviceName: modules_sdk_1.Modules.CART,
            relationship: {
                serviceName: modules_sdk_1.Modules.SALES_CHANNEL,
                primaryKey: "id",
                foreignKey: "sales_channel_id",
                alias: "sales_channel",
            },
        },
        {
            serviceName: modules_sdk_1.Modules.SALES_CHANNEL,
            relationship: {
                serviceName: modules_sdk_1.Modules.CART,
                primaryKey: "sales_channel_id",
                foreignKey: "id",
                alias: "carts",
                isList: true,
            },
        },
    ],
};
