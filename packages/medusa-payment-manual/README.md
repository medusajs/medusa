# Manual Payment

A minimal payment provider that allows merchants to handle payments manually.

[Medusa Website](https://medusajs.com/) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Provides a restriction-free payment provider that can be used during checkout and while processing orders.

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

  ```bash
  npm install medusa-payment-manual
  ```

2\. In `medusa-config.js` add the following at the end of the `plugins` array:

  ```js
  const plugins = [
    // ...
    `medusa-payment-manual`
  ]
  ```

---

## Test the Plugin

1\. Run the following command in the directory of the Medusa backend to run the backend:

  ```bash
  npm run start
  ```

2\. Enable the payment provider in a region in the admin. You can refer to [this User Guide](https://docs.medusajs.com/user-guide/regions/providers) to learn how to do that. Alternatively, you can use the [Admin APIs](https://docs.medusajs.com/api/admin#tag/Region/operation/PostRegionsRegion).

3\. Place an order using a storefront or the [Store APIs](https://docs.medusajs.com/api/store). You should be able to use Stripe as a payment method.
