# Adyen

Receive payments on your Medusa commerce application using Adyen.

> This plugin is not ready for production use. Community contributions are highly appreciated. You can learn more about contributing in [our repository](https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md).

[Medusa Website](https://medusajs.com/) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Authorize payments on orders from any sales channel.
- Support for MobilePay.
- Capture payments from the admin dashboard.
- Support for Webhooks.

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)
- [Adyen account](https://www.adyen.com)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

  ```bash
  npm install medusa-payment-adyen
  ```

2\. Set the following environment variables in `.env`:

  ```bash
  ADYEN_API_KEY=<YOUR_API_KEY>
  ADYEN_NOTIFICATION_HMAC=<YOUR_NOTIFICATION_HMAC>
  ADYEN_RETURN_URL=<YOUR_RETURN_URL>
  ADYEN_MERCHANT_ACCOUNT=<YOUR_MERCHANT_ACCOUNT>
  ADYEN_ORIGIN=<YOUR_ORIGIN>
  ADYEN_ENVIRONMENT=<YOUR_ENVIRONMENT>
  ADYEN_LIVE_ENDPOINT_PREFIX=<YOUR_LIVE_ENDPOINT_PREFIX>
  ADYEN_PAYMENT_ENDPOINT=<YOUR_PAYMENT_ENDPOINT>
  ```

3\. In `medusa-config.js` add the following at the end of the `plugins` array:

  ```js
  const plugins = [
    // ...
    {
      resolve: `medusa-payment-adyen`,
      options: {
        api_key: process.env.STRIPE_API_KEY,
        notification_hmac: process.env.ADYEN_NOTIFICATION_HMAC,
        return_url: process.env.ADYEN_RETURN_URL,
        merchant_account: process.env.ADYEN_MERCHANT_ACCOUNT,
        origin: process.env.ADYEN_ORIGIN,
        environment: process.env.ADYEN_ENVIRONMENT,
        live_endpoint_prefix: process.env.ADYEN_LIVE_ENDPOINT_PREFIX,
        payment_endpoint: process.env.ADYEN_PAYMENT_ENDPOINT,
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

2\. Enable Adyen in a region in the admin. You can refer to [this User Guide](https://docs.medusajs.com/user-guide/regions/providers) to learn how to do that. Alternatively, you can use the [Admin APIs](https://docs.medusajs.com/api/admin#tag/Region/operation/PostRegionsRegion).

3\. Place an order using a storefront or the [Store APIs](https://docs.medusajs.com/api/store). You should be able to use Stripe as a payment method.