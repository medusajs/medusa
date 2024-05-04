"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRegion = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.CartRegion = {
    isLink: true,
    isReadOnlyLink: true,
    extends: [
        {
            serviceName: modules_sdk_1.Modules.CART,
            relationship: {
                serviceName: modules_sdk_1.Modules.REGION,
                primaryKey: "id",
                foreignKey: "region_id",
                alias: "region",
            },
        },
        {
            serviceName: modules_sdk_1.Modules.REGION,
            relationship: {
                serviceName: modules_sdk_1.Modules.CART,
                primaryKey: "region_id",
                foreignKey: "id",
                alias: "carts",
                isList: true,
            },
        },
    ],
};
