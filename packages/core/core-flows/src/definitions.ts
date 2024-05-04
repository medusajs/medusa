export enum Workflows {
  // Product workflows
  CreateProducts = "create-products-old",
  UpdateProducts = "update-products-old",

  // Product Variant workflows
  CreateProductVariants = "create-product-variants-old",
  UpdateProductVariants = "update-product-variants-old",

  // Cart workflows
  CreateCart = "create-cart-old",

  CreateInventoryItems = "create-inventory-items-old",

  // Price list workflows
  CreatePriceList = "create-price-list-old",
  UpdatePriceLists = "update-price-lists-old",
  DeletePriceLists = "delete-price-lists-old",
  RemovePriceListProductPrices = "remove-price-list-products-old",
  RemovePriceListVariantPrices = "remove-price-list-variants-old",
  RemovePriceListPrices = "remove-price-list-prices-old",
}

export enum InputAlias {
  Products = "products",
  ProductsInputData = "productsInputData",
  RemovedProducts = "removedProducts",

  ProductVariants = "productVariants",
  ProductVariantsUpdateInputData = "productVariantsUpdateInputData",
  ProductVariantsCreateInputData = "productVariantsCreateInputData",

  InventoryItems = "inventoryItems",
  RemovedInventoryItems = "removedInventoryItems",

  AttachedInventoryItems = "attachedInventoryItems",
  DetachedInventoryItems = "detachedInventoryItems",

  InventoryItemsInputData = "inventoryItemsInputData",
}
