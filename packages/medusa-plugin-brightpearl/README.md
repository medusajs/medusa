# Brightpearl

Manage and streamline your business processes using Brightpearl.

[Medusa Website](https://medusajs.com/) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Send and sync orders with Brightpearl.
- Listen for inventory and stock movements in Brightpearl.
- Handle order returns through Brightpearl.

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)
- [Brightpearl account](https://www.brightpearl.com)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

  ```bash
  npm install medusa-plugin-brightpearl
  ```

2\. Set the following environment variables in `.env`:

  ```bash
  BRIGHTPEARL_ACCOUNT=<YOUR_ACCOUNT>
  BRIGHTPEARL_CHANNEL_ID=<YOUR_CHANNEL_ID>
  BRIGHTPEARL_BACKEND_URL=<YOUR_BACKEND_URL>
  BRIGHTPEARL_EVENT_OWNER=<YOUR_EVENT_OWNER>
  BRIGHTPEARL_WAREHOUSE=<YOUR_WAREHOUSE>
  BRIGHTPEARL_DEFAULT_STATUS_ID=<YOUR_DEFAULT_STATUS_ID>
  BRIGHTPEARL_SWAP_STATUS_ID=<YOUR_SWAP_STATUS_ID>
  BRIGHTPEARL_PAYMENT_METHOD_CODE=<YOUR_PAYMENT_METHOD_CODE>
  BRIGHTPEARL_SALES_ACCOUNT_CODE=<YOUR_SALES_ACCOUNT_CODE>
  BRIGHTPEARL_SHIPPING_ACCOUNT_CODE=<YOUR_SHIPPING_ACCOUNT_CODE>
  BRIGHTPEARL_DISCOUNT_ACCOUNT_CODE=<YOUR_DISCOUNT_ACCOUNT_CODE>
  BRIGHTPEARL_GIFT_CARD_ACCOUNT_CODE=<YOUR_GIFT_CARD_ACCOUNT_CODE>
  BRIGHTPEARL_INVENTORY_SYNC_CRON=<YOUR_INVENTORY_SYNC_CRON>
  ```

3\. In `medusa-config.js` add the following at the end of the `plugins` array:

  ```js
  const plugins = [
    // ...
    {
      resolve: `medusa-plugin-brightpearl`,
      options: {
        account: process.env.BRIGHTPEARL_ACCOUNT, // required, the Brightpearl account
        channel_id: process.env.BRIGHTPEARL_CHANNEL_ID, // required, channel id to map sales and credits to
        backend_url: process.env.BRIGHTPEARL_BACKEND_URL, // required, the url where the Medusa server is running, needed for webhooks
        event_owner: process.env.BRIGHTPEARL_EVENT_OWNER, // required, the id of the user who will own goods out events]
        warehouse: process.env.BRIGHTPEARL_WAREHOUSE, // required, the warehouse id to allocate orders from
        default_status_id: process.env.BRIGHTPEARL_DEFAULT_STATUS_ID, // (optional: defaults to 1), the status id to assign new orders with
        swap_status_id: process.env.BRIGHTPEARL_SWAP_STATUS_ID, // (optional: defaults to 1), the status id to assign new swaps]
        payment_method_code: process.env.BRIGHTPEARL_PAYMENT_METHOD_CODE, // (optional: defaults to 1220), the method code to register payments with
        sales_account_code: process.env.BRIGHTPEARL_SALES_ACCOUNT_CODE, // (optional: defaults to 4000), nominal code to assign line items to
        shipping_account_code: process.env.BRIGHTPEARL_SHIPPING_ACCOUNT_CODE, // (optional: defaults to 4040), nominal code to assign shipping line to
        discount_account_code: process.env.BRIGHTPEARL_DISCOUNT_ACCOUNT_CODE, // optional, nominal code to use for Discount-type refunds
        gift_card_account_code: process.env.BRIGHTPEARL_GIFT_CARD_ACCOUNT_CODE, // (optional: default to 4000), nominal code to use for gift card products and redeems
        inventory_sync_cron: process.env.BRIGHTPEARL_INVENTORY_SYNC_CRON, // (default: false), cron pattern for inventory sync, if left out the job will not be created
      },
    },
  ]
  ```

---

## Test the Plugin

1\. Run the following command in the directory of the Medusa backend to run the backend:

  ```bash
  npm run start
  ```

2\. On placing an order, you should see that order appear on Brightpearl.

---

## Additional Information

### Orders

When an order is created in Medusa it will automatically be sent to Brightpearl and allocated there. Once allocated it is up to Brightpearl to figure out how the order is to be fulfilled - the plugin listens for goods out notes and tries to map each of these to a Medusa order, if the matching succeeds Medusa will send the order to the fulfillment provider associated with the shipping method selected by the Customer.

When line items on an order are returned the plugin will generate a sales credit in Brightpearl.

### Products

The plugin doesn't automatically create products in Medusa, but listens for inventory changes in Brightpearl. The plugin updates each product variant to reflect the inventory quantity listed in Brightpearl, thereby ensuring that the inventory levels in Medusa are always in sync with Brightpearl.

### OAuth

The plugin registers an OAuth app in Medusa allowing installation at https://medusa-commerce.com/a/settings/apps. The OAuth tokens are refreshed every hour to prevent unauthorized requests.