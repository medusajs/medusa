"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRegion = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.OrderRegion = {
    isLink: true,
    isReadOnlyLink: true,
    extends: [
        {
            serviceName: modules_sdk_1.Modules.ORDER,
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
                serviceName: modules_sdk_1.Modules.ORDER,
                primaryKey: "region_id",
                foreignKey: "id",
                alias: "orders",
                isList: true,
            },
        },
    ],
};
