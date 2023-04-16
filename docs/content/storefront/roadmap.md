---
description: 'Learn about the different resources you need and the general steps to take while building your custom storefront that is connected to your Medusa backend.'
---

# Build Your Own Storefront Roadmap

In this document, you’ll learn about the different resources you need and the general steps to take while building your custom storefront that's connected to your Medusa backend.

## Overview

Although Medusa provides a Next.js starter storefront, you have full freedom in how you choose to build your storefront. This includes anything from what framework you choose to what functionalities you choose to include.

This guide provides a roadmap that can guide you into how you can build your own storefront, regardless of what tools you’re using.

---

## Connect to the Backend

The storefront connects to the backend to retrieve and process data. You can use different tools or libraries when connecting your storefront to the backend.

- **For React-based storefronts:** you can use [Medusa React](../medusa-react/overview.md). It provides you with the necessary hooks to retrieve or manipulate data on your backend.
- **For JavaScript frameworks:** you can use [Medusa’s JavaScript Client](../js-client/overview.md) in any JavaScript framework. This NPM package facilitates interacting with the backend’s REST APIs.
- **For other frontend technologies:** you can interact directly with the Medusa backend by sending requests to its [Store REST APIs](/api/store).

:::tip

In the store how-to guides that are available throughout the documentation, you’ll see snippets for all of these different options, which aims to facilitate your development.

:::

### Setting Cross-Origin Resource Sharing Configuration

Your Medusa backend uses Cross-Origin Resource Sharing (CORS) to ensure that only the hosts you specify can access your backend’s resources. Make sure to set your Medusa backend’s `store_cors` option to your storefront’s URL, as explained [here](../development/backend/configurations.md#storefront-cors).

During development, its value would typically be something like `localhost:8000` or any other port you’re using. For production, its value would be the public URL of the storefront. To make the development process easier, you can manage that using environment variables.

---

## Implement the Functionalities

This section will briefly touch upon some of the basic functionalities that are recommended to be implemented in your storefront, with guides that explain how to implement them.

### Regions Selection

Regions allow businesses to serve customers globally. On a storefront, the customer should be able to select their region.

[This guide](../modules/regions-and-currencies/storefront/use-regions.mdx) explains how you can retrieve the regions from the backend and show them in your storefront.

### Displaying Products

Customers should be able to browse products in your storefront and view their details.

[This guide](../modules/products/storefront/show-products.mdx) explains how you can list products in your store and show a single product’s detail.

### Implement Cart and Checkout

Customers should be able to add products to cart and go through the checkout flow.

[This guide](../modules/carts-and-checkout/storefront/implement-cart.mdx) explains how you can implement the cart and checkout functionalities in your storefront.

### Implement Customer Profiles

Customers should be able to register, log-in, edit their profile, and view their orders.

[This guide](../modules/customers/storefront/implement-customer-profiles.mdx) explains how to implement customer profile functionalities in your storefront.

### More Functionalities

Medusa’s backend provides much more functionalities, such as allowing customers to request returns, handle order edits, or request swaps. It all depends on what functionalities you want to implement in your storefront.

You can learn about all the available functionalities either through the [Store API reference](/api/store) or the [Commerce Modules](../modules/overview.mdx) part of the documentation, which holds different Store how-to guides.

### Integrating Plugins

Some plugins that you install on your backend require implementing storefront User Interface (UI). For most Medusa’s [official plugins](../plugins/overview.mdx), you can find guidance on how to do that in its designated documentation.

---

## Deploy the Storefront

:::tip

Make sure to deploy your backend before you deploy your storefront.

:::

Once you finish building your storefront, you can deploy it on any hosting. The deployment process depends on your hosting provider of choice.

The [Vercel Deployment guide for the Next.js storefront starter](../deployments/storefront/deploying-next-on-vercel.md) may provide some guidance in your process.
