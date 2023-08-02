export enum Workflows {
  // Product workflows
  CreateProducts = "create-products",

  // Cart workflows
  CreateCart = "create-cart",
}

export enum InputAlias {
  Products = "products",
  RemovedProducts = "removedProducts",

  Cart = "cart",
  RemovedCart = "removedCart",

  InventoryItems = "inventoryItems",
  RemovedInventoryItems = "removedInventoryItems",

  AttachedInventoryItems = "attachedInventoryItems",
  DetachedInventoryItems = "detachedInventoryItems",
}
