"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputAlias = exports.Workflows = void 0;
var Workflows;
(function (Workflows) {
    // Product workflows
    Workflows["CreateProducts"] = "create-products-old";
    Workflows["UpdateProducts"] = "update-products-old";
    // Product Variant workflows
    Workflows["CreateProductVariants"] = "create-product-variants-old";
    Workflows["UpdateProductVariants"] = "update-product-variants-old";
    // Cart workflows
    Workflows["CreateCart"] = "create-cart-old";
    Workflows["CreateInventoryItems"] = "create-inventory-items-old";
    // Price list workflows
    Workflows["CreatePriceList"] = "create-price-list-old";
    Workflows["UpdatePriceLists"] = "update-price-lists-old";
    Workflows["DeletePriceLists"] = "delete-price-lists-old";
    Workflows["RemovePriceListProductPrices"] = "remove-price-list-products-old";
    Workflows["RemovePriceListVariantPrices"] = "remove-price-list-variants-old";
    Workflows["RemovePriceListPrices"] = "remove-price-list-prices-old";
})(Workflows || (exports.Workflows = Workflows = {}));
var InputAlias;
(function (InputAlias) {
    InputAlias["Products"] = "products";
    InputAlias["ProductsInputData"] = "productsInputData";
    InputAlias["RemovedProducts"] = "removedProducts";
    InputAlias["ProductVariants"] = "productVariants";
    InputAlias["ProductVariantsUpdateInputData"] = "productVariantsUpdateInputData";
    InputAlias["ProductVariantsCreateInputData"] = "productVariantsCreateInputData";
    InputAlias["InventoryItems"] = "inventoryItems";
    InputAlias["RemovedInventoryItems"] = "removedInventoryItems";
    InputAlias["AttachedInventoryItems"] = "attachedInventoryItems";
    InputAlias["DetachedInventoryItems"] = "detachedInventoryItems";
    InputAlias["InventoryItemsInputData"] = "inventoryItemsInputData";
})(InputAlias || (exports.InputAlias = InputAlias = {}));
