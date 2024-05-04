"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionPaymentProvider = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
exports.RegionPaymentProvider = {
    serviceName: utils_1.LINKS.RegionPaymentProvider,
    isLink: true,
    databaseConfig: {
        tableName: "region_payment_provider",
        idPrefix: "regpp",
    },
    alias: [
        {
            name: ["region_payment_provider", "region_payment_providers"],
            args: {
                entity: "LinkRegionPaymentProvider",
            },
        },
    ],
    primaryKeys: ["id", "region_id", "payment_provider_id"],
    relationships: [
        {
            serviceName: modules_sdk_1.Modules.REGION,
            primaryKey: "id",
            foreignKey: "region_id",
            alias: "region",
        },
        {
            serviceName: modules_sdk_1.Modules.PAYMENT,
            primaryKey: "id",
            foreignKey: "payment_provider_id",
            alias: "payment_provider",
            args: { methodSuffix: "PaymentProviders" },
        },
    ],
    extends: [
        {
            serviceName: modules_sdk_1.Modules.REGION,
            fieldAlias: {
                payment_providers: "payment_provider_link.payment_provider",
            },
            relationship: {
                serviceName: utils_1.LINKS.RegionPaymentProvider,
                primaryKey: "region_id",
                foreignKey: "id",
                alias: "payment_provider_link",
                isList: true,
            },
        },
        {
            serviceName: modules_sdk_1.Modules.PAYMENT,
            fieldAlias: {
                regions: "region_link.region",
            },
            relationship: {
                serviceName: utils_1.LINKS.RegionPaymentProvider,
                primaryKey: "payment_provider_id",
                foreignKey: "id",
                alias: "region_link",
                isList: true,
            },
        },
    ],
};
