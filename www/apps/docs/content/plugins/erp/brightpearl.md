---
addHowToData: true
---

# Brightpearl

This document will guide you through installing the Brightpearl plugin on your Medusa backend.

## Overview

[Brightpearl](https://www.brightpearl.com/) is a Retail Operations Platform. It can be integrated to a business's different sales channels to provide features related to inventory management, automation, analytics and reporting, and more.

Medusa provides an official Brightpearl plugin with the following features:

- Send and sync orders with Brightpearl.
- Listen for inventory and stock movements in Brightpearl.
- Handle order returns through Brightpearl.

---

## Prerequisites

### Medusa Backend

A Medusa backend is required to be set up before following along with this document. You can follow the [quickstart guide](../../create-medusa-app.mdx) to get started in minutes.

### Brightpearl Account

Using this plugin requires having a [Webshipper account](https://www.brightpearl.com/) with access to development keys and resources.

---

## Install Plugin

In the directory of your Medusa backend, run the following command to install the plugin:

```bash npm2yarn
npm install medusa-plugin-brightpearl
```

Finally, add the plugin to the `plugins` array in `medusa-config.js`:

```js title="medusa-config.js"
const plugins = [
  // ...
  {
    resolve: `medusa-plugin-brightpearl`,
    options: {
      account: process.env.BRIGHTPEARL_ACCOUNT,
      backend_url: process.env.BRIGHTPEARL_BACKEND_URL,
      channel_id: process.env.BRIGHTPEARL_CHANNEL_ID,
      event_owner: process.env.BRIGHTPEARL_EVENT_OWNER,
      warehouse: process.env.BRIGHTPEARL_WAREHOUSE,
      // optional
      default_status_id: 
        process.env.BRIGHTPEARL_DEFAULT_STATUS_ID,
      swap_status_id: 
        process.env.BRIGHTPEARL_SWAP_STATUS_ID,
      claim_status_id: 
        process.env.BRIGHTPEARL_CLAIM_STATUS_ID,
      payment_method_code: 
        process.env.BRIGHTPEARL_PAYMENT_METHOD_CODE,
      sales_account_code: 
        process.env.BRIGHTPEARL_SALES_ACCOUNT_CODE,
      shipping_account_code: 
        process.env.BRIGHTPEARL_SHIPPING_ACCOUNT_CODE,
      discount_account_code: 
        process.env.BRIGHTPEARL_DISCOUNT_ACCOUNT_CODE,
      gift_card_account_code: 
        process.env.BRIGHTPEARL_GIFT_CARD_ACCOUNT_CODE,
      inventory_sync_cron: 
        process.env.BRIGHTPEARL_INVENTORY_SYNC_CRON,
      cost_price_list: 
        process.env.BRIGHTPEARL_COST_PRICE_LIST,
      base_currency: 
        process.env.BRIGHTPEARL_BASE_CURRENCY,
    },
  },
]
```

The plugin accepts the following options:

- `account`: (required) is a string indicating your account ID. You can refer to [Brightpearl's documentation](https://help.brightpearl.com/s/article/360028541892#:~:text=Your%20account%20ID%20can%20be,your%20email%20address%20and%20password.) on how to retrieve it.
- `channel_id`: (required) is a string indicating the ID of the channel to map sales and credits to.
- `backend_url`: (required) is a string indicating the URL of your Medusa backend. This is useful for webhooks.
- `event_owner`: (required) is a string indicating the ID of the contact used when sending the [Goods-Out Note Event](https://api-docs.brightpearl.com/warehouse/goods-out-note%20event/post.html).
- `warehouse`: (required) is a string indicating the ID of the warehouse to allocate order items' inventory from.
- `default_status_id`: (default: `3`) is a string indicating  the ID of the status to assign new orders. This value will also be used on swaps or claims if their respective options, `swap_status_id` and `claim_status_id`, are not provided.
- `swap_status_id`: (default: `3`) is a string indicating  the ID of the status to assign new swaps. If not provided and `default_status_id` is provided, the value of `default_status_id` will be used.
- `claim_status_id`: (default: `3`) is a string indicating  the ID of the status to assign new claims. If not provided and `default_status_id` is provided, the value of `default_status_id` will be used.
- `payment_method_code`: (default: `1220`) is a string indicating the payment method code to register payments with.
- `sales_account_code`: (default: `4000`) is a string indicating the nominal code to assign line items to.
- `shipping_account_code`: (default: `4040`) is a string indicating the nominal code to assign shipping lines to.
- `discount_account_code`: (optional) is a string indicating the nominal code to use for discount-type refunds.
- `gift_card_account_code`: (default: `4000`) is a string indicating the nominal code to use for gift card products and redeems.
- `inventory_sync_cron`: (optional) is a string indicating a cron pattern that should be used to create a scheduled job for syncing inventory. If not provided, the scheduled job will not be created.
- `cost_price_list`: (default: `1`) is a string indicating the ID of the price list to assign to created claims.
- `base_currency`: (default: `EUR`) is a string indicating the ISO 3 character code of the currency to assign to created claims.

Make sure to add the necessary environment variables for the above options in `.env`:

```bash
BRIGHTPEARL_ACCOUNT=<YOUR_ACCOUNT>
BRIGHTPEARL_CHANNEL_ID=<YOUR_CHANNEL_ID>
BRIGHTPEARL_BACKEND_URL=<YOUR_BACKEND_URL>
BRIGHTPEARL_EVENT_OWNER=<YOUR_EVENT_OWNER>
BRIGHTPEARL_WAREHOUSE=<YOUR_WAREHOUSE>
BRIGHTPEARL_DEFAULT_STATUS_ID=<YOUR_DEFAULT_STATUS_ID>
BRIGHTPEARL_SWAP_STATUS_ID=<YOUR_SWAP_STATUS_ID>
BRIGHTPEARL_CLAIM_STATUS_ID=<YOUR_CLAIM_STATUS_ID>
BRIGHTPEARL_PAYMENT_METHOD_CODE=<YOUR_PAYMENT_METHOD_CODE>
BRIGHTPEARL_SALES_ACCOUNT_CODE=<YOUR_SALES_ACCOUNT_CODE>
BRIGHTPEARL_SHIPPING_ACCOUNT_CODE=<YOUR_SHIPPING_ACCOUNT_CODE>
BRIGHTPEARL_DISCOUNT_ACCOUNT_CODE=<YOUR_DISCOUNT_ACCOUNT_CODE>
BRIGHTPEARL_GIFT_CARD_ACCOUNT_CODE=<YOUR_GIFT_CARD_ACCOUNT_CODE>
BRIGHTPEARL_INVENTORY_SYNC_CRON=<YOUR_INVENTORY_SYNC_CRON>
BRIGHTPEARL_COST_PRICE_LIST=<YOUR_COST_PRICE_LIST>
BRIGHTPEARL_BASE_CURRENCY=<YOUR_BASE_CURRENCY>
```

---

## Test the Plugin

To test the plugin, run the following command in the directory of the Medusa backend to start the backend:

```bash
npx medusa develop
```

Then, place an order either using a [storefront](../../starters/nextjs-medusa-starter.mdx) or the [Store REST APIs](https://docs.medusajs.com/api/store). The order should appear on Brightpearl.

---

## How the Plugin Works

### OAuth

The plugin registers an OAuth app in Medusa allowing installation at `<BACKEND_URL>/a/settings/apps`, where `<BACKEND_URL>` is the URL of your Medusa backend.

The OAuth tokens are refreshed every hour to prevent unauthorized requests.

### Orders and Fulfillments

When an order is created in the Medusa backend, it'll automatically be sent to Brightpearl and allocated there. Once allocated, it is up to Brightpearl to figure out how the order is to be fulfilled. The plugin listens for Goods-Out notes and tries to map each of these to a Medusa order. If the matching succeeds, the Medusa backend will send the order to the fulfillment provider associated with the shipping method selected by the Customer.

### Order Returns

When line items in an order are returned, the plugin will generate a sales credit in Brightpearl.

### Products

The plugin doesn't automatically create products in Medusa, but listens for inventory changes in Brightpearl. Then, the plugin updates each product variant to reflect the inventory quantity listed in Brightpearl, thereby ensuring that the inventory levels in Medusa are always in sync with Brightpearl.
