---
description: 'Learn what Sales Channels are and how they can be used in Medusa. Sales Channels allow merchants to separate between the different channels products are sold in.'
---

# Sales Channels

In this document, you’ll learn about Sales Channels and how they can be used in Medusa.

## Introduction

Sales Channels allow you to separate between the different channels you sell products in. For example, you can have a sales channel for your website and another for your mobile apps.

Sales Channels are associated with stores, products, carts, and orders: A store has a default sales channel; you can define which products are available in a sales channel; you can specify the sales channel of a cart; you can filter orders by sales channel.

### Example Use Cases

The sales channel feature can be used in a variety of use cases including:

- Implement a B2B Ecommerce Store.
- Specifying different products for each channel you sell in.
- Support Omnichannel in your ecommerce store.

---

## SalesChannel Entity Overview

A sales channel is stored in the database as a [SalesChannel](../../references/entities/classes/SalesChannel.md) entity. Some of its important attributes are:

- `name`: The name of the sales channel.
- `is_disabled`: A boolean value indicating of the Sales Channel is disabled or not.

---

## Relations to Other Entities

### Store

A store has a default sales channel. When you first run your Medusa backend or seed your database, a default sales channel is created, if it doesn’t exist, and associated with the store.

The relation is implemented in the [Store](../../references/entities/classes/Store.md) entity. You can access the default sales channel of a store by expanding the `default_sales_channel` relation and using `store.default_sales_channel`. You can also access the ID of the default sales channel using `store.default_sales_channel_id`.

### Product

Products can be available in more than one sales channel. You can then filter products by a sales channel using the Storefront and Admin APIs.

The relation is implemented in the [Product](../../references/entities/classes/Product.md) entity. You can access the sales channels a product is available in by expanding the `sales_channels` relation and using `product.sales_channels`.

### Cart

When you create a cart, you can optionally specify the sales channel it belongs to. If you don’t set the sales channel, the store’s default sales channel will be associated with it.

A cart can belong to only one sales channel. Only products that belong to the same sales channel as the cart can be added to it.

The relation is implemented in the [Cart](../../references/entities/classes/Cart.md) entity. You can access the sales channel a cart is associated with by expanding the `sales_channel` relation and using `cart.sales_channel`. You can also access the ID of the sales channel using `cart.sales_channel_id`.

### Order

Orders can optionally be associated with a sales channel. You can filter orders by a sales channel using the Storefront and Admin APIs.

The relation is implemented in the [Order](../../references/entities/classes/Order.md) entity. You can access the sales channel an order is associated with by expanding the `sales_channel` relation and using `order.sales_channel`. You can also access the ID of the sales channel using `order.sales_channel_id`.

---

## See Also

- [Manage sales channels using the admin APIs](./admin/manage.mdx)
- [Use sales channels in the storefront](./storefront/use-sales-channels.mdx)