# Stripe

Receive payments on your Medusa commerce application using Stripe.

[Stripe Plugin Documentation](https://docs.medusajs.com/plugins/payment/stripe) | [Medusa Website](https://medusajs.com/) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Authorize payments on orders from any sales channel.
- Support for Bancontact, BLIK, giropay, iDEAL, and Przelewy24.
- Capture payments from the admin dashboard.
- View payment analytics through Stripe's dashboard.
- Ready-integration with [Medusa's Next.js starter storefront](https://docs.medusajs.com/starters/nextjs-medusa-starter).
- Support for Stripe Webhooks.

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)
- [Stripe account](https://stripe.com/)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

  ```bash
  npm install medusa-payment-stripe
  ```

2\. Set the following environment variables in `.env`:

  ```bash
  STRIPE_API_KEY=sk_...
  # only necessary for production
  STRIPE_WEBHOOK_SECRET=whsec_...
  ```

3\. In `medusa-config.js` add the following at the end of the `plugins` array:

  ```js
  const plugins = [
    // ...
    {
      resolve: `medusa-payment-stripe`,
      options: {
        api_key: process.env.STRIPE_API_KEY,
        webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
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

2\. Enable Stripe in a region in the admin. You can refer to [this User Guide](https://docs.medusajs.com/user-guide/regions/providers) to learn how to do that. Alternatively, you can use the [Admin APIs](https://docs.medusajs.com/api/admin#tag/Region/operation/PostRegionsRegion).

3\. Place an order using a storefront or the [Store APIs](https://docs.medusajs.com/api/store). You should be able to use Stripe as a payment method.

---

## Additional Resources

- [Stripe Plugin Documentation](https://docs.medusajs.com/plugins/payment/stripe)
