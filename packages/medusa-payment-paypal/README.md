# PayPal

Receive payments on your Medusa commerce application using PayPal.

[PayPal Plugin Documentation](https://docs.medusajs.com/plugins/payment/paypal) | [Medusa Website](https://medusajs.com/) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Authorize payments on orders from any sales channel.
- Capture payments from the admin dashboard.
- View payment analytics through PayPal's dashboard.
- Ready-integration with [Medusa's Next.js starter storefront](https://docs.medusajs.com/starters/nextjs-medusa-starter).
- Support for Webhooks.

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)
- [PayPal account](https://www.paypal.com)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

  ```bash
  npm install medusa-payment-paypal
  ```

2\. Set the following environment variables in `.env`:

  ```bash
  PAYPAL_SANDBOX=true
  PAYPAL_CLIENT_ID=<CLIENT_ID>
  PAYPAL_CLIENT_SECRET=<CLIENT_SECRET>
  PAYPAL_AUTH_WEBHOOK_ID=<WEBHOOK_ID>
  ```

3\. In `medusa-config.js` add the following at the end of the `plugins` array:

  ```js
  const plugins = [
    // ...
    {
      resolve: `medusa-payment-paypal`,
      options: {
        sandbox: process.env.PAYPAL_SANDBOX,
        client_id: process.env.PAYPAL_CLIENT_ID,
        client_secret: process.env.PAYPAL_CLIENT_SECRET,
        auth_webhook_id: process.env.PAYPAL_AUTH_WEBHOOK_ID,
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

2\. Enable PayPal in a region in the admin. You can refer to [this User Guide](https://docs.medusajs.com/user-guide/regions/providers) to learn how to do that. Alternatively, you can use the [Admin APIs](https://docs.medusajs.com/api/admin#tag/Region/operation/PostRegionsRegion).

3\. Place an order using a storefront or the [Store APIs](https://docs.medusajs.com/api/store). You should be able to use Stripe as a payment method.

---

## Additional Resources

- [PayPal Plugin Documentation](https://docs.medusajs.com/plugins/payment/paypal)
