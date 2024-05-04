"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariantInventoryItem = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const utils_1 = require("@medusajs/utils");
exports.ProductVariantInventoryItem = {
    serviceName: utils_1.LINKS.ProductVariantInventoryItem,
    isLink: true,
    databaseConfig: {
        tableName: "product_variant_inventory_item",
        idPrefix: "pvitem",
        extraFields: {
            required_quantity: {
                type: "integer",
                defaultValue: "1",
            },
        },
    },
    alias: [
        {
            name: [
                "product_variant_inventory_item",
                "product_variant_inventory_items",
            ],
            args: {
                entity: "LinkProductVariantInventoryItem",
            },
        },
    ],
    primaryKeys: ["id", "variant_id", "inventory_item_id"],
    relationships: [
        {
            serviceName: modules_sdk_1.Modules.PRODUCT,
            primaryKey: "id",
            foreignKey: "variant_id",
            alias: "variant",
            args: {
                methodSuffix: "Variants",
            },
        },
        {
            serviceName: modules_sdk_1.Modules.INVENTORY,
            primaryKey: "id",
            foreignKey: "inventory_item_id",
            alias: "inventory",
            deleteCascade: true,
        },
    ],
    extends: [
        {
            serviceName: modules_sdk_1.Modules.PRODUCT,
            fieldAlias: {
                inventory: "inventory_items.inventory",
            },
            relationship: {
                serviceName: utils_1.LINKS.ProductVariantInventoryItem,
                primaryKey: "variant_id",
                foreignKey: "id",
                alias: "inventory_items",
                isList: true,
            },
        },
        {
            serviceName: modules_sdk_1.Modules.INVENTORY,
            fieldAlias: {
                variant: "variant_link.variant",
            },
            relationship: {
                serviceName: utils_1.LINKS.ProductVariantInventoryItem,
                primaryKey: "inventory_item_id",
                foreignKey: "id",
                alias: "variant_link",
            },
        },
    ],
};
