export enum Workflows {
  // Product workflows
  CreateProducts = "create-products",

  // Cart workflows
  CreateCart = "create-cart",
  AddShippingMethod = "add-shipping-method",

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

  Cart = "cart",

  AddShippingMethodInputData = "addShippingMethodInputData",

  LineItems = "lineItems",
  ShippingOptionToValidate = "shippingOptionToValidate",
  ValidatedShippingOptionData = "validatedShippingOptionData",
  ShippingOptionPrice = "shippingOptionPrice",
  CreatedShippingMethods = "CreatedShippingMethods",
  PreparedAddShippingMethodToCartData = "preparedAddShippingMethodToCartData",
}
