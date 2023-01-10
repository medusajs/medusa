# Overview

## Architecture

Medusa is composed of three components: The Medusa server, the admin dashboard, and the storefront.

![Medusa's Architecture](https://res.cloudinary.com/dza7lstvk/image/upload/v1667999772/Medusa%20Docs/Diagrams/ZHvM2bu_td4rnx.png)

### Medusa Server

The Medusa server is a headless backend built on Node.js. This is the main component that holds all the logic and data of the store. Your admin dashboard and storefront interact with the backend to retrieve, create, and modify data through REST APIs.

Your Medusa server will include all functionalities related to your store’s checkout workflow. That includes cart management, shipping and payment providers, user management, and more. It also allows you to configure your store including your store’s region, tax rules, discounts, gift cards, and more.

### Admin Dashboard

The admin dashboard is accessible by store operators. Store operators can use the admin dashboard to view, create, and modify data such as orders and products.

Medusa provides a beautiful [admin dashboard](https://demo.medusajs.com) that you can use right off the bat. Medusa's admin dashboard provides a lot of functionalities to manage your store including Order management, Product management, User management, and more.

You can also create your own admin dashboard by utilizing the [Admin REST APIs](https://docs.medusajs.com/api/admin).

### Storefront

Your customers use the Storefront to view products and make orders. Medusa provides two storefronts, one built with [Next.js](https://docs.medusajs.com/starters/nextjs-medusa-starter) and one with [Gatsby](https://docs.medusajs.com/starters/gatsby-medusa-starter). You are also free to create your own storefront using the [Storefront REST APIs](https://docs.medusajs.com/api/store/).

---

## Features

- [Orders, Exchanges, and Returns](./user-guide/orders/index.md): Aside from the standard order management that comes with ecommerce platforms, Medusa also provides an easy and automated way to manage swaps, returns, and claims.
- [Customers and Customer Groups](./user-guide/customers/index.md): Manage Customers and assign them to customer groups.
- [Products and Collections](./user-guide/products/index.mdx): Add products with extensive customization settings and sort them into collections.
- [Region](./user-guide/regions/index.md): Configure and manage multiple regions and currencies all from one platform.
- [Plugins](./advanced/backend/plugins/overview.md): Easily integrate fulfillment providers, payment providers, notification services, and many other custom tools and third-party services.
- [PriceList](./user-guide/price-lists/index.md) and [Discounts](./user-guide/discounts/): Advanced pricing for products with conditions based on the amount in the cart or promotions and discounts.
- [Taxes](./user-guide/taxes/index.md): Advanced tax configurations specific to multiple regions, with the capability of specifying taxes for specific products.
- [Sales Channels](./user-guide/sales-channels/index.md): Create multiple sales channels and control which sales channels products are available in.
- [Bulk Import](./user-guide/products/import.mdx): Bulk import strategies for different entities including [products](./advanced/admin/import-products.mdx) and [price lists](./advanced/admin/import-prices.mdx).
- [Bulk Export](./user-guide/products/export.mdx): Bulk export strategies for different entities including [products](./user-guide/products/export.mdx) and [orders](./user-guide/orders/export.mdx).
- Complete Customization Capabilities: Aside from all the features that Medusa provides, it is completely customizable providing capabilities to create custom [endpoints](./advanced/backend/endpoints/add.md), [services](./advanced/backend/services/create-service.md), [subscribers](./advanced/backend/subscribers/create-subscriber.md), [batch job strategies](./advanced/backend/batch-jobs/create.md), and much more!
