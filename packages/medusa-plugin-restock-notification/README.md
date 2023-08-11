# Restock Notifications

Send notifications to subscribed customers when an item has been restocked.

[Medusa Website](https://medusajs.com/) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Triggers an event when a product variant has been restocked.
- Provides an endpoint to subscribe customers to receive restock notifications.
- Does not implement the email or notification sending mechanisms. Instead, it is compatible with Notification plugins such as [SendGrid](https://docs.medusajs.com/plugins/notifications/sendgrid).

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)
- [Redis](https://docs.medusajs.com/development/backend/prepare-environment#redis)
- [PostgreSQL](https://docs.medusajs.com/development/backend/prepare-environment#postgresql)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

  ```bash
  npm install medusa-plugin-restock-notification
  ```

2\. In `medusa-config.js` add the following at the end of the `plugins` array:

  ```js
  const plugins = [
    // other plugins...
    {
      resolve: `medusa-plugin-restock-notification`,
      options: {
        trigger_delay, // optional, delay time in milliseconds
        inventory_required, // minimum inventory quantity to consider a variant as restocked
      },
    },
  ]
  ```

3\. Run the following command in the directory of the Medusa backend to run the plugin's migrations:

  ```bash
  medusa migrations run
  ```

---

## Test the Plugin

1\. Run the following command in the directory of the Medusa backend to run the backend:

  ```bash
  npm run start
  ```

2\. Subscribe an email or identification username (depends on your notification service) to receive restock notifications using the endpoint `/restock-notifications/variants/<variant_id>`. `<variant_id>` is the ID of the variant you're subscribing to.

2\. Change the inventory quantity of a product variant based on the restock threshold you've set, and see the event `restock-notification.restocked` triggered.

---

## Additional Information

### API endpoint

The plugin exposes an endpoint `/restock-notifications/variants/:variant_id` to sign emails up for restock notifications. It accepts the following request body:

```json
{
  "email": "customer@test.com"
}
```

The endpoint responds with `200 OK` on successful signups. If a signup for an already in stock item is attempted the endpoint will have a 400 response code.

### Restock events

The plugin listens for the `product-variant.updated` call and emits a `restock-notification.restocked` event when a variant with restock signups become available.

The data sent with the `restock-notification.restocked` event are:

- `variant_id`: The ID of the variant to listen for restock events for.
- `emails`: An array of emails that are to be notified of restocks.

For example:

```json
{
  "variant_id": "variant_1234567890",
  "emails": ["seb@test.com", "oli@test.com"]
}
```
