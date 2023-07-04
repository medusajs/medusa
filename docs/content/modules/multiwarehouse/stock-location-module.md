---
description: "In this document, you’ll learn about the inventory module, how it works, and its relation to other processes in your commerce application."
---

# Stock Level Module

In this document, you’ll learn about the Stock Level module and how it works.

## Overview

A stock location indicates a physical address that stock-kept items can be stored in. The stock location module handles functionalities related to managing stock locations and their addresses.

Medusa's Stock Location module is a standalone module that can be used in any commerce application, not just in a Medusa backend. This document gives a general overview of how the stock location module is designed, and highlights how the Medusa core orchestrates relations around this module when it's used with the Medusa backend.

---

## StockLocation Entity

The `StockLocation` entity represents a stock location. It has minimal attributes including a `name` attribute. It’s associated with the `StockLocationAddress` entity.

---

## StockLocationAddress Entity

The `StockLocationAddress` is an entitiy that contains address-related fields, such as `city` or `country_code`.

The `StockLocationAddress` entity belongs to the `StockLocation` entity. It is used to store the address details of a stock location.

---

## How the Module Integrates into Medusa

This section explains how the Medusa backend uses the stock location module along with its entities and other modules.

### Entities Relation Overview

The following entities in the Medusa backend each have an attribute that is used to associate them with a stock location:

- `Fulfillment`: The `location_id` attribute within the `Fulfillment` entity is used to indicate from which stock location an order item is fulfilled.
- `Return`: The `location_id` attribute within the `Return` entity is used to indicate to which stock location an order item is returned.
- `Store`: The `default_location_id` attribute within the `Store` entity is used to indicate the default stock location to use in the ecommerce store.
- `SalesChannelLocation`: This entity is used to attach a stock location to a `SalesChannel`. The relation between these two entities is explained further in the [Relation to Sales Channel section](#relation-to-saleschannel).

When the Medusa's Stock Location module is used with the Medusa backend, the ID that is associated with the attributes mentioned above is from the `StockLocation` module.

The Medusa backend also orchestrates between different modules. The [Inventory Module](./inventory-module.md)'s entities contain the following attributes to handle associations between them and a stock location:

- `InventoryLevel`: This entity is used to indicate the stocked quantity of an inventory item in a stock location. As explained in the [Inventory Module documentation](./inventory-module.md#inventorylevel), the `InventoryLevel` entity has an attribute `location_id`.
- `ReservationItem`: This entity is used to indicate the reserved quantity of an inventory item in a stock location. As explained in the [Inventory Module documentation](./inventory-module.md#reservationitem), the `ReservationItem` entity has an attribute `location_id`.

When both modules are used within the Medusa backend, the Medusa backend bridges between these modules by passing the ID of a `StockLocation` from the stock location module to the inventory module, and the inventory module uses the ID in its entities.

### Relation to SalesChannel

A stock location can be associated with more than one sales channel. For example, a physical store and an online store can use the same stock location.

As the `StockLocation` and `SalesChannel` entities are available in separate modules, the Medusa backend handles attaching the stock location with the sales channel within the `SalesChannelLocation` entity.

This relation is used across the Medusa backend and within checkout and order workflows:

- When checking the availability of an inventory item during checkout, the Medusa backend retrieves the location IDs that are associated with the cart’s sales channel using the `SalesChannelLocation`, then passes it along to the inventory module to perform the quantity check.
- When an order is placed, the Medusa backend retrieves the location IDs that are associated with the cart’s sales channel using the `SalesChannelLocation` entity, and passes it to the inventory module that reserves the ordered quantity of the inventory item from that location. The admin can later change the stock location if necessary.
- When an item in an order is fulfilled, the admin chooses a stock location to fulfill the item from. Similarly, when an item in an order is returned, the admin can choose a stock location to return the item to. The Medusa backend then passes the ID of the location from the stock module to the inventory module to perform inventory management functionalities.
