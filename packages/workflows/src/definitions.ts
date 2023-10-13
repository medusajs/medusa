export enum Workflows {
  // Product workflows
  CreateProducts = "create-products",
  UpdateProducts = "update-products",

  // Cart workflows
  CreateCart = "create-cart",

  CreateInventoryItems = "create-inventory-items",
}

export enum InputAlias {
  Products = "products",
  ProductsInputData = "productsInputData",
  RemovedProducts = "removedProducts",

  InventoryItems = "inventoryItems",
  RemovedInventoryItems = "removedInventoryItems",

  AttachedInventoryItems = "attachedInventoryItems",
  DetachedInventoryItems = "detachedInventoryItems",

  InventoryItemsInputData = "inventoryItemsInputData",
}
