# Klarna

Receive payments on your Medusa commerce application using Klarna.

[Klarna Plugin Documentation](https://docs.medusajs.com/plugins/payment/klarna) | [Medusa Website](https://medusajs.com/) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Authorize payments on orders from any sales channel.
- Capture payments from the admin dashboard.
- Support for Webhooks.

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)
- [Klarna account](https://www.klarna.com/)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

  ```bash
  npm install medusa-payment-klarna
  ```

2\. Set the following environment variables in `.env`:

  ```bash
  KLARNA_BACKEND_URL=<YOUR_KLARNA_BACKEND_URL>
  KLARNA_URL=<YOUR_KLARNA_URL>
  KLARNA_USER=<YOUR_KLARNA_USER>
  KLARNA_PASSWORD=<YOUR_KLARNA_PASSWORD>
  KLARNA_TERMS_URL=<YOUR_KLARNA_TERMS_URL>
  KLARNA_CHECKOUT_URL=<YOUR_KLARNA_CHECKOUT_URL>
  KLARNA_CONFIRMATION_URL=<YOUR_KLARNA_CONFIRMATION_URL>
  ```

3\. In `medusa-config.js` add the following at the end of the `plugins` array:

  ```js
  const plugins = [
    // other plugins...
    {
      resolve: `medusa-payment-klarna`,
      options: {
        backend_url: process.env.KLARNA_BACKEND_URL,
        url: process.env.KLARNA_URL,
        user: process.env.KLARNA_USER,
        password: process.env.KLARNA_PASSWORD,
        merchant_urls: {
          terms: process.env.KLARNA_TERMS_URL,
          checkout: process.env.KLARNA_CHECKOUT_URL,
          confirmation: process.env.KLARNA_CONFIRMATION_URL,
        },
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

2\. Enable Klarna in a region in the admin. You can refer to [this User Guide](https://docs.medusajs.com/user-guide/regions/providers) to learn how to do that. Alternatively, you can use the [Admin APIs](https://docs.medusajs.com/api/admin#tag/Region/operation/PostRegionsRegion).

3\. Place an order using a storefront or the [Store APIs](https://docs.medusajs.com/api/store). You should be able to use Stripe as a payment method.

---

## Additional Resources

- [Klarna Plugin Documentation](https://docs.medusajs.com/plugins/payment/klarna)