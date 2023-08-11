# Webshipper

Handle order fulfillments using Webshipper.

[Medusa Website](https://medusajs.com) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Webshipper can be used as a shipping option during checkouts and for handling order fulfillment.
- Sync order details and updates with Webshipper.
- Support for Webshipper webhooks.

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)
- [Webshipper Account](https://webshipper.com)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

  ```bash
  npm install medusa-fulfillment-webshipper
  ```

2\. Set the following environment variables in `.env`:

  ```bash
  WEBSHIPPER_ACCOUNT=<YOUR_WEBSHIPPER_ACCOUNT>
  WEBSHIPPER_API_TOKEN=<YOUR_WEBSHIPPER_API_TOKEN>
  WEBSHIPPER_ORDER_CHANNEL_ID=<YOUR_WEBSHIPPER_ORDER_CHANNEL_ID>
  WEBSHIPPER_WEBHOOK_SECRET=<YOUR_WEBSHIPPER_WEBHOOK_SECRET>
  WEBSHIPPER_COO_COUNTRIES=<WEBSHIPPER_COO_COUNTRIES>
  WEBSHIPPER_DELETE_ON_CANCEL=<WEBSHIPPER_DELETE_ON_CANCEL>
  ```

3\. In `medusa-config.js` add the following at the end of the `plugins` array:

  ```js
  const plugins = [
    // ...
    {
      resolve: `medusa-fulfillment-webshipper`,
      options: {
        account: process.env.WEBSHIPPER_ACCOUNT, // required
        api_token: process.env.WEBSHIPPER_API_TOKEN, // required
        order_channel_id: process.env.WEBSHIPPER_ORDER_CHANNEL_ID, // required, the channel id to register orders on
        webhook_secret: process.env.WEBSHIPPER_WEBHOOK_SECRET, // required, the webhook secret used to listen for shipments
        coo_countries: process.env.WEBSHIPPER_COO_COUNTRIES, // default: "all", an array of countries or a string of one country in which a Certificate of Origin will be attached
        delete_on_cancel: process.env.WEBSHIPPER_DELETE_ON_CANCEL, // default: false, determines whether Webshipper orders are deleted when a Medusa fulfillment is canceled
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

2\. Enable the fulfillment provider in the admin. You can refer to [this User Guide](https://docs.medusajs.com/user-guide/regions/providers) to learn how to do that. Alternatively, you can use the [Admin APIs](https://docs.medusajs.com/api/admin#tag/Region/operation/PostRegionsRegion).

3\. Place an order using a storefront or the [Store APIs](https://docs.medusajs.com/api/store). You should be able to use the manual fulfillment provider during checkout.

---

## Additional Details

### Personal Customs Numbers

In countries like South Korea, a personal customs number is required to clear customs. The Webshipper fulfillment plugin is able pass this information to Webshipper given that the number is stored in `order.shipping_address.metadata.personal_customs_no`.

#### Modifications in Checkout Flow

To pass the information along you should dynamically show an input field to the customer when they are shopping from a region that requires a personal customs number, and make sure that the metadata field is set when updating the cart shipping address.

```js
const onUpdateAddress = async () => {
  const address = {
    first_name: "John",
    last_name: "Johnson",
    ...,
    metadata: {
      personal_customs_no: "my-customs-number"
    }
  }

  await medusaClient.carts
    .update(cartId, {
      shipping_address: address
    })
    .then(() => {
      console.log("Good stuff - Webshipper will pass along the customs number")
    })
}
```