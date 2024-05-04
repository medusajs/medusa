"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryLevelStockLocation = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.InventoryLevelStockLocation = {
    isLink: true,
    isReadOnlyLink: true,
    extends: [
        {
            serviceName: modules_sdk_1.Modules.INVENTORY,
            relationship: {
                serviceName: modules_sdk_1.Modules.STOCK_LOCATION,
                primaryKey: "id",
                foreignKey: "location_id",
                alias: "stock_locations",
                isList: true,
            },
        },
    ],
};
