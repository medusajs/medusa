---
addHowToData: true
---

# Wishlist Plugin

In this document, you’ll learn how to install the Wishlist plugin on your Medusa backend.

## Overview

A wishlist allows customers to save items they like so they can browse and purchase them later. Medusa's wishlist plugin provides the following features:

- Allow a customer to manage their wishlist, including adding or deleting items.
- Allow a customer to share their wishlist with others using a token.

:::tip

Items in the wishlist are added as line items. This allows you to implement functionalities like moving an item from the wishlist to the cart, although this is not implemented by the plugin.

:::

---

## Prerequisites

Before you follow this guide, you must have a Medusa backend installed. If not, you can follow the [quickstart guide](../../create-medusa-app.mdx) to learn how to do it.

---

## Install Plugin

In the directory of your Medusa backend, run the following command to install the plugin:

```bash npm2yarn
npm install medusa-plugin-wishlist
```

Finally, add the plugin to the `plugins` array in `medusa-config.js`:

```js title="medusa-config.js"
const plugins = [
  // ...
  {
    resolve: `medusa-plugin-wishlist`,
  },
]
```

---

## Test the Plugin

Before testing the plugin, run the following command in the directory of the Medusa backend to start the backend:

```bash
npx medusa develop
```

The plugin exposes four API Routes.

### Add Item to Wishlist API Route

The `POST` API Route at `/store/customers/<CUSTOMER_ID>/wishlist` allows customers to add items to their existing or new wishlist, where `<CUSTOMER_ID>` is the ID of the customer. It accepts the following body parameters:

- `variant_id`: a string indicating the ID of the product variant to add to the wishlist.
- `quantity`: (optional) a number indicating the quantity of the product variant.
- `metadata`: (optional) any metadata to attach to the wishlist item.

The request returns the full customer object. The wishlist is available at `customer.metadata.wishlist`, where its value is an array of items.

### Delete Item from Wishlist API Route

The `DELETE` API Route at `/store/customers/<CUSTOMER_ID>/wishlist` allows customers to delete items from their wishlist, where `<CUSTOMER_ID>` is the ID of the customer.

The API Route accepts one request body parameter `index`, which indicates the index of the item in the `customer.metadata.wishlist` array.

The request returns the full customer object. The wishlist is available at `customer.metadata.wishlist`, where its value is an array of items.

#### Generate Share Token API Route

The `POST` API Route at `/store/customers/<CUSTOMER_ID>/wishlist/share-token` allows customers to retrieve a token that can be used to access the wishlist, where `<CUSTOMER_ID>` is the ID of the customer.

The API Route doesn't accept any request body parameters.

The request returns an object in the response having the property `share_token`, being the token that can be used to access the wishlist.

#### Access Wishlist with Token API Route

The `GET` API Route at `/wishlists/<TOKEN>` allows anyone to access the wishlist using its token, where `<TOKEN>` is the token retrieved from the [Generate Share Token API Route](#generate-share-token-api-token).

The API Route doesn't accept any request body parameters.

The request returns an object in the response having the following properties:

- `items`: an array of objects, each being an item in the wishlist.
- `first_name`: a string indicating the first name of the customer that this wishlist belongs to.
