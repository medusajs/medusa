export enum Workflows {
  // Product workflows
  CreateProducts = "create-products",
  UpdateProducts = "update-products",

  // Product Variant workflows
  CreateProductVariants = "create-product-variants",
  UpdateProductVariants = "update-product-variants",

  // Cart workflows
  CreateCart = "create-cart",

  CreateInventoryItems = "create-inventory-items",

  // Price list workflows
  CreatePriceList = "create-price-list",
  UpdatePriceLists = "update-price-lists",
  DeletePriceLists = "delete-price-lists",
  RemovePriceListProductPrices = "remove-price-list-products",
  RemovePriceListVariantPrices = "remove-price-list-variants",
  RemovePriceListPrices = "remove-price-list-prices",
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
