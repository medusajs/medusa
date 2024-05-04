"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartCustomer = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.CartCustomer = {
    isLink: true,
    isReadOnlyLink: true,
    extends: [
        {
            serviceName: modules_sdk_1.Modules.CART,
            relationship: {
                serviceName: modules_sdk_1.Modules.CUSTOMER,
                primaryKey: "id",
                foreignKey: "customer_id",
                alias: "customer",
            },
        },
        {
            serviceName: modules_sdk_1.Modules.CUSTOMER,
            relationship: {
                serviceName: modules_sdk_1.Modules.CART,
                primaryKey: "customer_id",
                foreignKey: "id",
                alias: "carts",
                isList: true,
            },
        },
    ],
};
