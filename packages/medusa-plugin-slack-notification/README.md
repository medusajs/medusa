# Slack

Receive new order notifications on Slack.

[Slack Plugin Documentation](https://docs.medusajs.com/plugins/notifications/slack) | [Medusa Website](https://medusajs.com) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Receive details about new orders including purchased items, totals, customer information, and more.

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)
- [Slack account](https://slack.com)
- [Redis](https://docs.medusajs.com/development/backend/prepare-environment#redis)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

  ```bash
  npm install medusa-plugin-slack-notification
  ```

2\. Set the following environment variable in `.env`:

  ```bash
  SLACK_WEBHOOK_URL=<YOUR_SLACK_WEBHOOK_URL>
  SLACK_ADMIN_ORDERS_URL=<YOUR_ADMIN_ORDERS_URL>
  ```

3\. In `medusa-config.js` add the following at the end of the `plugins` array:

  ```js
  const plugins = [
    // ...,
    {
      resolve: `medusa-plugin-slack-notification`,
      options: {
        show_discount_code: false, // optional, whether the discount code should be shown in notifications
        slack_url: process.env.SLACK_WEBHOOK_URL,
        admin_orders_url: process.env.SLACK_ADMIN_ORDERS_URL, // for example, http://localhost:7001/a/orders
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

2\. Place an order using a storefront or the [Store APIs](https://docs.medusajs.com/api/store). You should receive a notification on your Slack workspace.

---

## Additional Resources

- [Slack Plugin Documentation](https://docs.medusajs.com/plugins/notifications/slack)
