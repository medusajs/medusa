"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinerConfig = exports.entityNameToLinkableKeysMap = exports.LinkableKeys = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const _models_1 = require("./models");
exports.LinkableKeys = {
    cart_id: _models_1.Cart.name,
    line_item_id: _models_1.LineItem.name,
    shipping_method_id: _models_1.ShippingMethod.name,
    address_id: _models_1.Address.name,
    line_item_adjustment_id: _models_1.LineItemAdjustment.name,
    shipping_method_adjustment_id: _models_1.ShippingMethodAdjustment.name,
    line_item_tax_line_id: _models_1.LineItemTaxLine.name,
    shipping_method_tax_line_id: _models_1.ShippingMethodTaxLine.name,
};
const entityLinkableKeysMap = {};
Object.entries(exports.LinkableKeys).forEach(([key, value]) => {
    entityLinkableKeysMap[value] ?? (entityLinkableKeysMap[value] = []);
    entityLinkableKeysMap[value].push({
        mapTo: key,
        valueFrom: key.split("_").pop(),
    });
});
exports.entityNameToLinkableKeysMap = entityLinkableKeysMap;
exports.joinerConfig = {
    serviceName: modules_sdk_1.Modules.CART,
    primaryKeys: ["id"],
    linkableKeys: exports.LinkableKeys,
    alias: [
        {
            name: ["cart", "carts"],
            args: {
                entity: _models_1.Cart.name,
            },
        },
        {
            name: ["line_item", "line_items"],
            args: {
                entity: _models_1.LineItem.name,
                methodSuffix: "LineItems",
            },
        },
        {
            name: ["shipping_method", "shipping_methods"],
            args: {
                entity: _models_1.ShippingMethod.name,
                methodSuffix: "ShippingMethods",
            },
        },
        {
            name: ["address", "addresses"],
            args: {
                entity: _models_1.Address.name,
                methodSuffix: "Addresses",
            },
        },
        {
            name: ["line_item_adjustment", "line_item_adjustments"],
            args: {
                entity: _models_1.LineItemAdjustment.name,
                methodSuffix: "LineItemAdjustments",
            },
        },
        {
            name: ["shipping_method_adjustment", "shipping_method_adjustments"],
            args: {
                entity: _models_1.ShippingMethodAdjustment.name,
                methodSuffix: "ShippingMethodAdjustments",
            },
        },
        {
            name: ["line_item_tax_line", "line_item_tax_lines"],
            args: {
                entity: _models_1.LineItemTaxLine.name,
                methodSuffix: "LineItemTaxLines",
            },
        },
        {
            name: ["shipping_method_tax_line", "shipping_method_tax_lines"],
            args: {
                entity: _models_1.ShippingMethodTaxLine.name,
                methodSuffix: "ShippingMethodTaxLines",
            },
        },
    ],
};
