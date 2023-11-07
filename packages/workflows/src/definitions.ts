export enum Workflows {
  // Product workflows
  CreateProducts = "create-products",
  UpdateProducts = "update-products",

  // Product Variant workflows
  UpdateProductVariants = "update-product-variants",

  // Cart workflows
  CreateCart = "create-cart",

  CreateInventoryItems = "create-inventory-items",

  // Price list workflows
  CreatePriceList = "create-price-list",
  UpdatePriceLists = "update-price-lists",
}

export enum InputAlias {
  Products = "products",
  ProductsInputData = "productsInputData",
  RemovedProducts = "removedProducts",

  ProductVariants = "productVariants",
  ProductVariantsUpdateInputData = "productVariantsUpdateInputData",

  InventoryItems = "inventoryItems",
  RemovedInventoryItems = "removedInventoryItems",

  AttachedInventoryItems = "attachedInventoryItems",
  DetachedInventoryItems = "detachedInventoryItems",

  InventoryItemsInputData = "inventoryItemsInputData",
}
