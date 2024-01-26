---
description: "In this document, you’ll learn about the inventory module, how it works, and its relation to other processes in your commerce application."
---

# Inventory Module

In this document, you’ll learn about the inventory module and how it works.

## Overview

The inventory module includes all functionalities related to product inventory. It implements inventory management for a product, confirming whether a product is available across inventory levels, and updating the inventory availability of a product variant at different points in the order lifecycle.

Medusa's Inventory module is a standalone module that can be used in any commerce application, not just in a Medusa backend. This document gives a general overview of how the inventory module is designed, then explains how the Medusa core orchestrates relations and processes around this module when it's used with the Medusa backend.

---

## Entities Overview

![Inventory Module Entities Diagram](https://res.cloudinary.com/dza7lstvk/image/upload/v1680184977/Medusa%20Docs/Diagrams/inventory-diagram_1_eaupf2.jpg)

### InventoryItem

The `InventoryItem` entity represents a stock-kept item. It holds inventory details, such as `origin_country` or `hs_code`. It's not associated with any entity that represents a stock-kept item, enabling you to choose how you integrate it with your existing commerce application.

The `InventoryItem` entity doesn’t hold data regarding where the item is stored or its available quantity. This data is stored in the `InventoryLevel` entity.

### InventoryLevel

The `InventoryLevel` entity represents the quantity of an inventory item in a stock location. This ensures that an inventory item can be located in multiple stock locations.

Among the `InventoryLevel` entity’s attributes, the following provide insights into the available quantity within that entity:

- `stocked_quantity`: a number indicating the available stock of that item in the associated location.
- `reserved_quantity`: a number indicating the quantity that should be reserved from the available `stocked_quantity`. It can be used to indicate a quantity that is still not removed from stock, but should be considered as unavailable which confirming that an item is in stock.
- `incoming_quantity`: a number indicating an incoming stock quantity of the item into the associated location. This attribute doesn't play into the `stocked_quantity` or when confirming whether a stock-kept item is in stock.

The `InventoryLevel` entity is associated with a location through the `location_id` attribute. The entity representing a location isn't implemented with this module, allowing for greater flexibility in how you choose to implement a location.

### ReservationItem

The `ReservationItem` entity represents a quantity of an inventory item that is reserved when an order is placed but not fulfilled yet. This indicates that the stock-kept item still hasn't been moved from stock, but should be considered as unavailable.

The `ReservationItem` entity has the following notable attributes, among others:

- `line_item_id`: The ID of the line item in the order that this reservation item refers to.
- `inventory_item_id`: The ID of the inventory item this reservation item refers to.
- `location_id`: The ID of the location that this item is reserved from.
- `quantity`: A number indicating the quantity to be reserved.

---

## How the Module Integrates into Medusa

This section explains how the Medusa backend uses the inventory module along with its entities and other modules, and in its processes.

### Entities Relation Overview

The core Medusa package contains an entity `ProductVariantInventoryItem` that is used to establish a relation between a product variant and an inventory item. This enables you to use inventory management features on the product variant level, while maintaining the modularity that allows you to use Medusa's inventory module or implement your custom inventory module.

When you use Medusa's Inventory Module, the Medusa backend uses the `ProductVariantInventoryItem` entity as a bridge between the `InventoryItem` entity and the `ProductVariant` entity.

![Inventory Item's Relation to Product Variants in the Medusa Backend](https://res.cloudinary.com/dza7lstvk/image/upload/v1680185070/Medusa%20Docs/Diagrams/inventory-item-medusa-diagram_i21ht8.jpg)

The Medusa backend also orchestrates between the installed inventory and stock location modules. The association between an Inventory Level and a location is handled by passing the ID of a location from the stock location module to the inventory module when an Inventory Level is being created. When using Medusa's [Stock Location module](./stock-location-module.md), the entity representing the location is `StockLocation`.

![Inventory Level's relation to Stock Location Module in the Medusa Backend](https://res.cloudinary.com/dza7lstvk/image/upload/v1680185151/Medusa%20Docs/Diagrams/inventory-medusa-diagram_ltojt9.jpg)

Similarly, the Medusa backend associates the `ReservationItem` entity with a line item and a location by passing the IDs of each to the inventory module when a reservation item is created.

### Product Variant Creation Process

In the Medusa backend, when a product variant that has an enabled `manage_inventory` attribute is created, the backend uses the inventory module to automatically create an inventory item along with the product variant. When the inventory item is created, the Medusa backend attaches it to the product variant using the `ProductVariantInventoryItem` entity as explained earlier.

The Medusa backend uses the inventory module to create Inventory Levels when the admin sets the available quantity of a product variant in a stock location.

### Cart and Checkout

During the cart and checkout workflow, for example when a product variant is added to the cart or during cart validation, the Medusa backend uses the inventory module to confirm that items in the cart have sufficient stock to be purchased in the desired quantity. If a product variant doesn't have an inventory item, which is the case when the `manage_inventory` attribute of the variant is disabled, the variant is assumed to be available in stock.

As an inventory item can exist in multiple locations, the inventory module checks across those locations. The Medusa backend retrieves the locations based on the sales channel of the cart, as each location is associated with a sales channel, and passes them along to the inventory module to perform the checking.

:::tip

You can learn more about the relation between Stock Locations and Sales Channels in the [Stock Location documentation](./stock-location-module.md).

:::

Then, the inventory module confirms that the product variant has sufficient quantity across these locations by summing all the `stocked_quantity` of the inventory levels associated with these locations. When retrieving the `stocked_quantity` of each of the inventory levels, the `reserved_quantity` is subtracted from it to ensure accurate availability.

### Order Placement

When an order is placed, the Medusa backend uses the inventory module to reserve the ordered quantity of line items that are associated with product variants having an enabled `manage_inventory` attribute. The reserved quantity is indicated by creating a reservation item for each line item, associating it with its inventory item and a stock location.

The Medusa backend chooses the stock location randomly from the available stock locations associated with the order’s sales channel. The admin can later change which stock location the item will be fulfilled from.

### Order Fulfillment

When an item in the order is fulfilled, and the item is associated with a product variant that has an enabled `manage_inventory`, the Medusa backend uses the inventory module to subtract the inventory level's `reserved_quantity` from the `stocked_quantity`. The inventory module also resets the `reserved_quantity` to `0`.

### Order Return

When an item in the order is returned, and the item is associated with a product variant that has an enabled `manage_inventory`, the Medusa backend uses the inventory module to increment the inventory level's `stocked_quantity` with the returned amount.
