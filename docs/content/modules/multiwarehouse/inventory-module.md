---
description: "In this document, you’ll learn about the inventory module, how it works, and its relation to other processes in your commerce application."
---

# Inventory Module

In this document, you’ll learn about the inventory module, how it works, and its relation to other processes in your commerce application.

## Overview

The inventory module includes all functionalities related to product inventory. It implements inventory management for a product variant, confirming whether a variant is available across inventory levels, and updating the inventory availability of a product variant at different points in the order lifecycle.

---

## Entities Overview

![Inventory Entities Diagram](https://res.cloudinary.com/dza7lstvk/image/upload/v1680092873/Medusa%20Docs/Diagrams/inventory-diagram_hlu1pf.jpg)

### InventoryItem

The `InventoryItem` entity represents the physical item related to a product variant. It holds inventory details related to the variant, such as `origin_country` or `hs_code`.

An inventory item is attached to a product variant, however, the relation isn’t managed within the inventory module. As the `InventoryItem` and `ProductVariant` entities are available in separate modules, the core Medusa package handles attaching the inventory item with the product variant within the `ProductVariantInventoryItem` entity.

:::tip

This approach maintains isolation between the different modules, delegating the orchestration between them to the core Medusa package.

:::

The `InventoryItem` entity doesn’t hold data regarding where the product variant is stored or its available quantity. This data is stored in the `InventoryLevel` entity.

### InventoryLevel

The `InventoryLevel` entity represents the quantity of an inventory item in a stock location. This ensures that an inventory item can be located in multiple stock locations, and allows admins to manage the available stock for different locations.

Among the `InventoryLevel` entity’s attributes, the following provide insights into the available quantity within that entity:

- `stocked_quantity`: a number indicating the available stock of that item in the associated location.
- `reserved_quantity`: a number indicating the quantity that should be reserved from the available `stocked_quantity`. Reserved quantity represents the quantity of the item that has been used in placed orders but haven’t been fulfilled yet. The process around this is explained further in the [Order Placement section](#order-placement).
- `incoming_quantity`: a number indicating an incoming stock quantity of the item into the associated location. This attribute does not play into the `stocked_quantity` or when confirming whether a product variant is in stock.

The `InventoryLevel` entity is associated with a location through the `location_id` attribute. There’s no direct relation between this `InventoryLevel` and a location entity, allowing for greater flexibility in what type of location that can be implemented. The core Medusa package assigns the value of `location_id` to the ID of an instance of the `StockLocation` entity, which is available within the [Stock Location module](./stock-location-module.md).

### ReservationItem

The `ReservationItem` entity represents a quantity of an inventory item that is reserved when an order is placed but not fulfilled yet. The process and importance of this is explained further in the [Order Placement section](#order-placement).

The `ReservationItem` entity has the following notable attributes, among others:

- `line_item_id`: The ID of the line item in the order that this reservation item refers to.
- `inventory_item_id`: The ID of the inventory item this reservation item refers to.
- `location_id`: The ID of the location that this item is reserved from. This is inferred from the sales channel when the order is placed, but can be edited by the admin.
- `quantity`: A number indicating the quantity to be reserved.

---

## Inventory Process Overview

### Product Variant Creation

When a product variant is created, an inventory item is created along with the product variant automatically if the `manage_inventory` attribute in the variant is enabled. When the inventory item is created, it is attached to the product variant, which is represented by the `ProductVariantInventoryItem` entity as explained earlier.

Inventory Levels are created when the admin sets the available quantity of a product variant in a stock location.

### Cart and Checkout

During the cart and checkout workflow, for example when a product inventory is added to the cart or during cart validation, the inventory module is used to confirm that an item has sufficient stock to be purchased in the desired quantity.

As an inventory item can exist in multiple locations, the checking is done across those locations. The locations are retrieved based on the sales channel of the cart, as each location is associated with a sales channel.

:::tip

You can learn more about the relation between Stock Locations and Sales Channels in the [Stock Location documentation](./stock-location-module.md).

:::

Then, the inventory module confirms that the product variant has sufficient quantity across these locations by adding all the `stocked_quantity` of the inventory levels associated with these locations. When retrieving the `stocked_quantity` of each of the inventory levels, the `reserved_quantity` is subtracted from it to ensure accurate availability.

### Order Placement

When an order is placed, the ordered quantity of line items associated with product variants with enabled `manage_inventory` are considered reserved. The reserved quantity is indicated by creating a reservation item for each line item, associating it with its inventory item and a stock location.

The stock location is chosen randomly from the available stock locations associated with the order’s sales channel. The admin can later change which stock location the item will be fulfilled from.

### Order Fulfillment

When an item in the order is fulfilled, and the item is associated with a product variant that has an enabled `manage_inventory`, the `stocked_quantity` of the inventory level is decremented with the amount in `reserved_quantity`, and `reserved_quantity` is reset to `0`.

### Order Return

When an item in the order is returned, and the item is associated with a product variant that has an enabled `manage_inventory`, the `stocked_quantity` of the inventory level is incremented with the returned amount.
