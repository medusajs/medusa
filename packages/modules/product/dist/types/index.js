"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCollectionEvents = exports.ProductEvents = exports.ProductCategoryEvents = void 0;
var ProductCategoryEvents;
(function (ProductCategoryEvents) {
    ProductCategoryEvents["CATEGORY_UPDATED"] = "product-category.updated";
    ProductCategoryEvents["CATEGORY_CREATED"] = "product-category.created";
    ProductCategoryEvents["CATEGORY_DELETED"] = "product-category.deleted";
})(ProductCategoryEvents || (exports.ProductCategoryEvents = ProductCategoryEvents = {}));
var ProductEvents;
(function (ProductEvents) {
    ProductEvents["PRODUCT_UPDATED"] = "product.updated";
    ProductEvents["PRODUCT_CREATED"] = "product.created";
    ProductEvents["PRODUCT_DELETED"] = "product.deleted";
})(ProductEvents || (exports.ProductEvents = ProductEvents = {}));
var ProductCollectionEvents;
(function (ProductCollectionEvents) {
    ProductCollectionEvents["COLLECTION_UPDATED"] = "product-collection.updated";
    ProductCollectionEvents["COLLECTION_CREATED"] = "product-collection.created";
    ProductCollectionEvents["COLLECTION_DELETED"] = "product-collection.deleted";
})(ProductCollectionEvents || (exports.ProductCollectionEvents = ProductCollectionEvents = {}));
