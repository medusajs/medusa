---
addHowToData: true
---

# Restock Notifications Plugin

In this document, you’ll learn how to install the restock notification plugin on your Medusa backend.

:::note

This plugin doesn't actually implement the sending of the notification, only the required implementation to trigger restock events and allow customers to subscribe to product variants' stock status. To send the notification, you need to use a [notification plugin](../notifications/).

:::

## Overview

Customers browsing your products may find something that they need, but it's unfortunately out of stock. In this scenario, you can keep them interested in your product and, subsequently, in your store by notifying them when the product is back in stock.

The Restock Notifications plugin provides new API Routes that allow the customer to subscribe to restock notifications of a specific product variant. It also triggers the `restock-notification.restocked` event whenever a product variant's stock quantity is above a specified threshold. The event's payload includes the ID of the product variant and the customer emails subscribed to it. You can pair this with a subscriber that listens to that event and sends a notification to the customer using a [Notification plugin](../notifications/).

---

## Prerequisites

### Medusa Backend

Before you follow this guide, you must have a Medusa backend installed. If not, you can follow the [quickstart guide](../../create-medusa-app.mdx) to learn how to do it.

### Event-Bus Module

To trigger events to the subscribed handler functions, you must have an event-bus module installed. For development purposes, you can use the [Local Module](../../development/events/modules/local.md)  which should be enabled by default in your Medusa backend.

For production, it's recommended to use the [Redis Module](../../development/events/modules/redis.md).

---

## Install Plugin

In the root directory of your Medusa backend, run the following command to install the Restock Notifications plugin:

```bash npm2yarn
npm install medusa-plugin-restock-notification
```

Then, add the plugin into the plugins array exported as part of the Medusa configuration in `medusa-config.js`:

```js title="medusa-config.js"
const plugins = [
  // other plugins...
  {
    resolve: `medusa-plugin-restock-notification`,
    options: {
      // optional options
      trigger_delay, // delay time in milliseconds
      inventory_required, // minimum restock inventory quantity
    },
  },
]
```

The plugin accepts the following optional options:

1. `trigger_delay`: a number indicating the time in milliseconds to delay the triggering of the `restock-notification.restocked` event. Default value is `0`.
2. `inventory_required`: a number indicating the minimum inventory quantity to consider a product variant as restocked. Default value is `0`.

Finally, run the migrations of this plugin before you start the Medusa backend:

```bash
npx medusa migrations run
```

---

## Test Plugin

### 1. Run Medusa Backend

In the root of your Medusa backend project, run the following command to start the Medusa backend:

```bash npm2yarn
npm run start
```

### 2. Subscribe to Variant Restock Notifications

Then, send a `POST` request to the API Route `<BACKEND_URL>/restock-notifications/variants/<VARIANT_ID>` to subscribe to restock notifications of a product variant ID. Note that `<BACKEND_URL>` refers to the URL fo your Medusa backend, which is `http://localhost:9000` during development, and `<VARIANT_ID>` refers to the ID of the product variant you're subscribing to.

:::note

You can only subscribe to product variants that are out-of-stock. Otherwise, you'll receive an error.

:::

The API Route accepts the following request body parameters:

1. `email`: a string indicating the email that is subscribing to the product variant's restock notification.
2. `sales_channel_id`: an optional string indicating the ID of the sales channel to check the stock quantity in when subscribing. This is useful if you're using multi-warehouse modules, as the product variant's quantity is checked correctly when checking if it's out of stock. Alternatively, you can pass the [publishable API key in the header of the request](../../development/publishable-api-keys/storefront/use-in-requests.md) and the sales channel will be derived from it.

### 3. Trigger Restock Notification

After subscribing to the out-of-stock variant, change its stock quantity to the minimum inventory required to test out the event trigger. The new stock quantity should be any value above `0` if you didn't set the `inventory_required` option.

You can use the [Medusa Admin](../../user-guide/products/manage.mdx#manage-product-variants) or the [Admin REST API Routes](https://docs.medusajs.com/api/admin#products_postproductsproductvariantsvariant) to update the quantity.

After you update the quantity, you can see the `restock-notification.restocked` triggered and logged in the Medusa backend logs. If you've implemented the notification sending, this is where it'll be triggered and a notification will be sent.

---

## Example: Implement Notification Sending with SendGrid

:::note

The SendGrid plugin already listens to and handles the `restock-notification.restocked` event. So, if you install it you don't need to manually create a subscriber that handles this event as explained here. This example is only provided for reference on how you can send a notification to the customer using a Notification plugin.

:::

Here's an example of a [subscriber](../../development/events/subscribers.mdx) that listens to the `restock-notification.restocked` event and uses the [SendGrid plugin](../notifications/sendgrid.mdx) to send the subscribed customers an email:

```ts title="src/subscribers/restock-notification.ts"
import { 
  type SubscriberConfig, 
  type SubscriberArgs,
  ProductVariantService,
} from "@medusajs/medusa"

export default async function handleRestockNotification({ 
  data, eventName, container, pluginOptions, 
}: SubscriberArgs<Record<string, string>>) {
  const sendgridService = container.resolve("sendgridService")
  const productVariantService: ProductVariantService = 
    container.resolve("productVariantService")

  // retrieve variant
  const variant = await this.productVariantService_.retrieve(
    data.variant_id
  )

  this.sendGridService_.sendEmail({
    templateId: "restock-notification",
    from: "hello@medusajs.com",
    to: data.emails,
    dynamic_template_data: {
      // any data necessary for your template...
      variant,
    },
  })
}

export const config: SubscriberConfig = {
  event: "restock-notification.restocked",
  context: {
    subscriberId: "restock-handler",
  },
}
```

The handler function receives in the `data` property of the first parameter the following properties:

- `variant_id`: The ID of the variant that has been restocked.
- `emails`: An array of strings indicating the email addresses subscribed to the restocked variant. Here, you pass it along to the SendGrid plugin directly to send the email to everyone subscribed. If necessary, you can also retrieve the customer of that email using the `CustomerService`'s [retrieveByEmail](../../references/services/classes/services.CustomerService.mdx#retrievebyemail) method.

In the handler function, you retrieve the variant by its ID using the `ProductVariantService`, then send the email using the SendGrid plugins' `SendGridService`.
