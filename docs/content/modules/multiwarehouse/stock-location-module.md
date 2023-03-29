---
description: "In this document, you’ll learn about the inventory module, how it works, and its relation to other processes in your commerce application."
---

# Stock Level Module

In this document, you’ll learn about the Stock Level module, how it works, and its relation to other entities and processes within your commerce application.

## Overview

A stock location indicates a physical address that inventory items can be stored in. The stock location module handles functionalities related to managing stock locations that allow admins to have full control over the available stock locations in their commerce application.

---

## StockLocation Entity

The `StockLocation` entity represents the stock location that an admin creates. It has minimal attributes including a `name` attribute. It’s associated with a `StockLocationAddress`.

There are various entities in external modules or the core Medusa package that have an indirect relation with the `StockLocation` entity. These are:

- `Fulfillment`: The `location_id` attribute within the `Fulfillment` entity is used to indicate from which stock location an order item is fulfilled.
- `Return`: The `location_id` attribute within the `Return` entity is used to indicate to which stock location an order item is returned.
- `Store`: The `default_location_id` attribute within the `Store` entity is used to indicate the default stock location to use in the ecommerce store.
- `SalesChannelLocation`: This entity is used to attach a `StockLocation` to a `SalesChannel`. The relation between these two entities is explained further in the [Relation to Sales Channel section](#relation-to-saleschannel).
- `InventoryLevel`: This entity is used to indicate the stocked quantity of an inventory item in a stock location. The relation is explained further in the [Relation to Inventory section](#relation-to-inventorylevel).
- `ReservationItem`: This entity is used to indicate the reserved quantity of an inventory item in a stock location. The relation is explained further in the [Relation to ReservationItem section](#relation-to-reservationitem).

### Relation to InventoryLevel

An inventory level indicates the available stock of an item in a stock location. As explained in the [Inventory Module documentation](./inventory-module.md#inventorylevel), the `InventoryLevel` entity has an attribute `location_id`. The value of this attribute is an ID of a `StockLocation`.

### Relation to ReservationItem

A reservation item indicates a reserved quantity of an item in a stock location due to an order placed but not fulfilled yet. As explained in the [Inventory Module documentation](./inventory-module.md#reservationitem), the `ReservationItem` entity has an attribute `location_id`. The value of this attribute is an ID of a `StockLocation`.

### Relation to SalesChannel

A stock location can be associated with more than one sales channel. For example, a physical store and an online store can use the same stock location.

Although the `StockLocation` and `SalesChannel` entities are linked, the relation isn’t managed within the stock channel module. As the `StockLocation` and `SalesChannel` entities are available in separate modules, the core Medusa package handles attaching the stock location with the sales channel within the `SalesChannelLocation` entity.

:::tip

This approach maintains isolation between the different modules, delegating the orchestration between them to the core Medusa package.

:::

This relation is used across the commerce application and within checkout and order workflows:

- When checking the availability of an inventory item during checkout, the checking is done in the locations that are associated with the cart’s sales channel. This process is explained further in the [Inventory Module documentation](./inventory-module.md#cart-and-checkout).
- When an order is placed, the ordered quantity of the inventory item is reserved from one of the locations associated with the cart’s sales channel. The admin can later change the stock location if necessary. This process is explained further in the [Inventory Module documentation](./inventory-module.md#order-placement).
- When an item in an order is fulfilled, a stock location can be chosen to fulfill the item from. Similarly, when an item in an order is returned, a stock location can be chosen to return the item to.

---

## StockLocationAddress Entity

The `StockLocationAddress` is an entitiy that contains address-related fields, such as `city` or `country_code`.

The `StockLocationAddress` entity belongs to the `StockLocation` entity. It is used to store the address details of a stock location.
