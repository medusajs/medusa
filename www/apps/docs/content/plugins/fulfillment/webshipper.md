---
addHowToData: true
---

# Webshipper

This document will guide you through installing the Webshipper fulfillment plugin on your Medusa backend.

## Overview

[Webshipper](https://webshipper.com/) is a service that allows merchants to connect to multiple carriers through a single Webshipper account. Developers can then integrate webshipper with ecommerce store like Medusa to handle shipping and fulfillment.

Medusa provides an official plugin that allows you to integrate Webshipper in your store. When integrated, you can provide customers with Webshippers' shipping options on checkout, and process and handle fulfillment and shipments of orders through Webshipper.

---

## Prerequisites

### Medusa Backend

A Medusa backend is required to be set up before following along with this document. You can follow the [quickstart guide](../../create-medusa-app.mdx) to get started in minutes.

### Webshipper Account

Using this plugin requires having a [Webshipper account](https://webshipper.com/) with access to development keys and resources.

---

## Install Plugin

In the directory of your Medusa backend, run the following command to install the plugin:

```bash npm2yarn
npm install medusa-fulfillment-webshipper
```

Next, add the plugin to the `plugins` array in `medusa-config.js`:

```js title="medusa-config.js"
const plugins = [
  // ...
  {
    resolve: `medusa-fulfillment-webshipper`,
    options: {
      account: process.env.WEBSHIPPER_ACCOUNT,
      api_token: process.env.WEBSHIPPER_API_TOKEN,
      order_channel_id: 
        process.env.WEBSHIPPER_ORDER_CHANNEL_ID,
      webhook_secret: process.env.WEBSHIPPER_WEBHOOK_SECRET,
      return_address: {
        // Webshipper Shipping Address fields
      },
      // optional
      coo_countries: process.env.WEBSHIPPER_COO_COUNTRIES,
      delete_on_cancel: 
        process.env.WEBSHIPPER_DELETE_ON_CANCEL !== "false",
      document_size: process.env.WEBSHIPPER_DOCUMENT_SIZE,
      return_portal: {
        id: process.env.WEBSHIPPER_RETURN_PORTAL_ID,
        cause_id: 
          process.env.WEBSHIPPER_RETURN_PORTAL_CAUSE_ID,
        refund_method_id: 
          process.env.WEBSHIPPER_RETURN_REFUND_METHOD_ID,
      },
    },
  },
]
```

The plugin accepts the following options:

- `account`: (required) is a string indicating your account name. If you're unsure of it, it's in the first part of the URL you use when accessing the Webshipper UI which has the format `https://<account name>.webshipper.io`.
- `api_token`: (required) is a string indicating your API token. You can create it from the Webshipper UI under Settings > Access and tokens.
- `order_channel_id`: (required) is a string indicating the ID of the order channel to retrieve shipping rates from.
- `webhook_secret`: (required) is a string indicating the secret used to sign the HMAC in webhooks.
- `return_address`: (required for returns) is an object that indicates the return address that should be used when fulfilling an order return. Refer to [Webshipper's API reference](https://docs.webshipper.io/#shipping_addresses) for accepted properties in this object.
- `coo_countries`: (default: `all`) is a list of ISO 3 character country codes used when attaching a Certificate of Origin. To support all countries you can set the value to `all`.
- `delete_on_cancel`: (default: `false`) is a boolean value that determines whether Webshipper orders should be deleted when its associated Medusa fulfillment is canceled.
- `document_size`: (default: `A4`) is a string indicating the size used when retrieving documents, such as fulfillment documents. The accepted values, based on Webshipoer's documentation, are `100X150`, `100X192`, or `A4`.
- `return_portal`: is an optional object that includes options related to order returns. It includes the following properties:
  - `id`: is a string indicating the ID of the return portal to use when fulfilling an order return.
  - `cause_id`: is a string indicating the ID of the return cause to use when fulfilling an order return.
  - `refund_method_id` is a string indicating the ID of the refund method to use when fulfilling an order return.

Make sure to add the necessary environment variables for the above options in `.env`:

```bash
WEBSHIPPER_ACCOUNT=<YOUR_WEBSHIPPER_ACCOUNT>
WEBSHIPPER_API_TOKEN=<YOUR_WEBSHIPPER_API_TOKEN>
WEBSHIPPER_ORDER_CHANNEL_ID=<YOUR_WEBSHIPPER_ORDER_CHANNEL_ID>
WEBSHIPPER_WEBHOOK_SECRET=<YOUR_WEBSHIPPER_WEBHOOK_SECRET>
WEBSHIPPER_COO_COUNTRIES=<YOUR_WEBSHIPPER_COO_COUNTRIES>
WEBSHIPPER_DELETE_ON_CANCEL=<YOUR_WEBSHIPPER_DELETE_ON_CANCEL>
WEBSHIPPER_DOCUMENT_SIZE=<YOUR_WEBSHIPPER_DOCUMENT_SIZE>
# Return Portal Variables
WEBSHIPPER_RETURN_PORTAL_ID=<YOUR_WEBSHIPPER_RETURN_PORTAL_ID>
WEBSHIPPER_RETURN_PORTAL_CAUSE_ID=<YOUR_WEBSHIPPER_RETURN_PORTAL_CAUSE_ID>
WEBSHIPPER_RETURN_REFUND_METHOD_ID=<YOUR_WEBSHIPPER_RETURN_REFUND_METHOD_ID>
```

---

## Test the Plugin

To test the plugin, run the following command in the directory of the Medusa backend to start the backend:

```bash
npx medusa develop
```

Then, you must enable the Webshipper Fulfillment Provider in at least one region to use it. You can do that using either the [Medusa Admin](../../user-guide/regions/providers.mdx), which is available at `http://localhost:7001` after you run the above command, or the [Admin REST APIs](../../modules/regions-and-currencies/admin/manage-regions.mdx).

After enabling the provider, you must add shipping options for that provider. You can also do that using either the [Medusa Admin](../../user-guide/regions/shipping-options.mdx) or the [Admin REST APIs](../../modules/regions-and-currencies/admin/manage-regions.mdx#add-a-shipping-option-to-a-region).

Finally, try to place an order using either a [storefront](../../starters/nextjs-medusa-starter.mdx) or the [Store APIs](https://docs.medusajs.com/api/store). You should be able to use the shipping options you created for the fulfillment provider.

---

## Personal Customs Numbers

In countries like South Korea, a personal customs number is required to clear customs. The Webshipper plugin is able pass this information to Webshipper given that the number is stored in `order.shipping_address.metadata.personal_customs_no`.

### Adding Field in Checkout Flow

To allow the customer to pass their personal customs number along with the order, you should dynamically show an input field to the customer when they are shopping from a region that requires a personal customs number. Then, make sure that the `metadata` field includes the personal customs number when updating the cart's shipping address.

```ts
const onUpdateAddress = async () => {
  const address = {
    first_name: "John",
    last_name: "Johnson",
    // ...,
    metadata: {
      // TODO the value should be replaced with the
      // value entered by the customer
      personal_customs_no: "my-customs-number",
    },
  }

  await medusaClient.carts
    .update(cartId, {
      shipping_address: address,
    })
    .then(() => {
      console.log(
        "Webshipper will pass along the customs number"
      )
    })
}
```
