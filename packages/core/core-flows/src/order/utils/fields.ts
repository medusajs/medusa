export const productVariantsFields = [
  "id",
  "title",
  "sku",
  "manage_inventory",
  "allow_backorder",
  "is_discountable",
  "barcode",
  "product.id",
  "product.title",
  "product.description",
  "product.status",
  "product.subtitle",
  "product.thumbnail",
  "product.type.value",
  "product.type.id",
  "product.collection.id",
  "product.collection.title",
  "product.handle",
  "product.discountable",
  "inventory_items.inventory_item_id",
  "inventory_items.inventory.id",
  "inventory_items.required_quantity",
  "inventory_items.inventory.requires_shipping",
  "inventory_items.inventory.location_levels.id",
  "inventory_items.inventory.location_levels.stocked_quantity",
  "inventory_items.inventory.location_levels.reserved_quantity",
  "inventory_items.inventory.location_levels.location_id",
  "inventory_items.inventory.location_levels.raw_stocked_quantity",
  "inventory_items.inventory.location_levels.raw_reserved_quantity",
  "inventory_items.inventory.location_levels.stock_locations.id",
  "inventory_items.inventory.location_levels.stock_locations.name",
  "inventory_items.inventory.location_levels.stock_locations.sales_channels.id",
  "inventory_items.inventory.location_levels.stock_locations.sales_channels.name",
]

/**
 * Cache tags for what the caching module cannot compute from a response shaped by the
 * `productVariantsFields` above (optionally combined with
 * `requiredVariantFieldsForInventoryConfirmation`). Must be passed with
 * `computeAutomaticTags: true`.
 *
 * Deliberately kept separate from the cart module's equivalent: these fields never
 * read a shipping profile, so tagging this response with
 * `LinkProductShippingProfile:list:*` would evict it every time a product's shipping
 * profile is attached or detached, for no coverage.
 */
export const productVariantsCacheTags = [
  // Reservations adjust inventory levels without emitting inventory level events.
  "ReservationItem:list:*",
  "LinkProductVariantInventoryItem:list:*",
  "LinkSalesChannelStockLocation:list:*",
]
