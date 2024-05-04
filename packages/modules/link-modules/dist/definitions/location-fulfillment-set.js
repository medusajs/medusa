"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationFulfillmentSet = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
exports.LocationFulfillmentSet = {
    serviceName: utils_1.LINKS.LocationFulfillmentSet,
    isLink: true,
    databaseConfig: {
        tableName: "location_fulfillment_set",
        idPrefix: "locfs",
    },
    alias: [
        {
            name: ["location_fulfillment_set", "location_fulfillment_sets"],
            args: {
                entity: "LinkLocationFulfillmentSet",
            },
        },
    ],
    primaryKeys: ["id", "stock_location_id", "fulfillment_set_id"],
    relationships: [
        {
            serviceName: modules_sdk_1.Modules.STOCK_LOCATION,
            primaryKey: "id",
            foreignKey: "stock_location_id",
            alias: "location",
        },
        {
            serviceName: modules_sdk_1.Modules.FULFILLMENT,
            primaryKey: "id",
            foreignKey: "fulfillment_set_id",
            alias: "fulfillment_set",
            deleteCascade: true,
        },
    ],
    extends: [
        {
            serviceName: modules_sdk_1.Modules.STOCK_LOCATION,
            relationship: {
                serviceName: utils_1.LINKS.LocationFulfillmentSet,
                primaryKey: "stock_location_id",
                foreignKey: "id",
                alias: "fulfillment_set_link",
                isList: true,
            },
            fieldAlias: {
                fulfillment_sets: "fulfillment_set_link.fulfillment_set",
            },
        },
        {
            serviceName: modules_sdk_1.Modules.FULFILLMENT,
            relationship: {
                serviceName: utils_1.LINKS.LocationFulfillmentSet,
                primaryKey: "fulfillment_set_id",
                foreignKey: "id",
                alias: "locations_link",
            },
        },
    ],
};
