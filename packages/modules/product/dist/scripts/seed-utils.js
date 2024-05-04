"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductVariants = exports.createProducts = exports.createProductCategories = void 0;
const _models_1 = require("../models");
async function createProductCategories(manager, categoriesData) {
    const categories = [];
    for (let categoryData of categoriesData) {
        let categoryDataClone = { ...categoryData };
        let parentCategory = null;
        const parentCategoryId = categoryDataClone.parent_category_id;
        delete categoryDataClone.parent_category_id;
        if (parentCategoryId) {
            parentCategory = await manager.findOne(_models_1.ProductCategory, parentCategoryId);
        }
        const category = manager.create(_models_1.ProductCategory, {
            ...categoryDataClone,
            parent_category: parentCategory,
        });
        categories.push(category);
    }
    await manager.persistAndFlush(categories);
    return categories;
}
exports.createProductCategories = createProductCategories;
async function createProducts(manager, data) {
    const products = data.map((productData) => {
        return manager.create(_models_1.Product, productData);
    });
    await manager.persistAndFlush(products);
    return products;
}
exports.createProducts = createProducts;
async function createProductVariants(manager, data) {
    const variants = data.map((variantsData) => {
        return manager.create(_models_1.ProductVariant, variantsData);
    });
    await manager.persistAndFlush(variants);
    return variants;
}
exports.createProductVariants = createProductVariants;
