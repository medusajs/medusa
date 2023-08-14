export enum Workflows {
  CreateProducts = "create-products",
  CreateCart = "create-cart",
  AddShippingMethod = "add-shipping-method",
  AddLineItemToCart = "add-line-item-to-cart",
}

export enum InputAlias {
  Products = "products",
  ProductsInputData = "productsInputData",
  RemovedProducts = "removedProducts",

  InventoryItems = "inventoryItems",
  RemovedInventoryItems = "removedInventoryItems",

  AttachedInventoryItems = "attachedInventoryItems",
  DetachedInventoryItems = "detachedInventoryItems",

  Cart = "cart",

  AddShippingMethodInputData = "addShippingMethodInputData",

  LineItems = "lineItems",
  ShippingOptionToValidate = "shippingOptionToValidate",
  ValidatedShippingOptionData = "validatedShippingOptionData",
  ShippingOptionPrice = "shippingOptionPrice",
  CreatedShippingMethods = "CreatedShippingMethods",
  PreparedAddShippingMethodToCartData = "preparedAddShippingMethodToCartData",
}
