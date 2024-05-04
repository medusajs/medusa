"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinerConfig = exports.entityNameToLinkableKeysMap = exports.LinkableKeys = void 0;
const modules_sdk_1 = require("@medusajs/modules-sdk");
const _models_1 = require("./models");
const product_image_1 = __importDefault(require("./models/product-image"));
exports.LinkableKeys = {
    product_id: _models_1.Product.name,
    product_handle: _models_1.Product.name,
    variant_id: _models_1.ProductVariant.name,
    variant_sku: _models_1.ProductVariant.name,
    product_option_id: _models_1.ProductOption.name,
    product_type_id: _models_1.ProductType.name,
    product_category_id: _models_1.ProductCategory.name,
    product_collection_id: _models_1.ProductCollection.name,
    product_tag_id: _models_1.ProductTag.name,
    product_image_id: product_image_1.default.name,
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
    serviceName: modules_sdk_1.Modules.PRODUCT,
    primaryKeys: ["id", "handle"],
    linkableKeys: exports.LinkableKeys,
    alias: [
        {
            name: ["product", "products"],
            args: {
                entity: "Product",
            },
        },
        {
            name: ["product_variant", "product_variants", "variant", "variants"],
            args: {
                entity: "ProductVariant",
                methodSuffix: "Variants",
            },
        },
        {
            name: ["product_option", "product_options"],
            args: {
                entity: "ProductOption",
                methodSuffix: "Options",
            },
        },
        {
            name: ["product_type", "product_types"],
            args: {
                entity: "ProductType",
                methodSuffix: "Types",
            },
        },
        {
            name: ["product_image", "product_images"],
            args: {
                entity: "ProductImage",
                methodSuffix: "Images",
            },
        },
        {
            name: ["product_tag", "product_tags"],
            args: {
                entity: "ProductTag",
                methodSuffix: "Tags",
            },
        },
        {
            name: ["product_collection", "product_collections"],
            args: {
                entity: "ProductCollection",
                methodSuffix: "Collections",
            },
        },
        {
            name: ["product_category", "product_categories"],
            args: {
                entity: "ProductCategory",
                methodSuffix: "Categories",
            },
        },
    ],
};
