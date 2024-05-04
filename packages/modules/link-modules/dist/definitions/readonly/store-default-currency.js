"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreDefaultCurrency = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
exports.StoreDefaultCurrency = {
    isLink: true,
    isReadOnlyLink: true,
    extends: [
        {
            serviceName: modules_sdk_1.Modules.STORE,
            relationship: {
                serviceName: modules_sdk_1.Modules.CURRENCY,
                primaryKey: "code",
                foreignKey: "default_currency_code",
                alias: "default_currency",
            },
        },
    ],
};
