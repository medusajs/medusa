# e-conomic

Manage your commerce accounting with e-conomic.

> This plugin is not ready for production use. Community contributions are highly appreciated. You can learn more about contributing in [our repository](https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md).

[Medusa Website](https://medusajs.com/) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Create draft and book e-conomic invoices automatically when an order is placed.
- Provide endpoints to manually trigger booking and creating draft e-comonic invoices.

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)
- [Visma e-conomic account](https://www.e-conomic.com/developer/connect)
- [Redis](https://docs.medusajs.com/development/backend/prepare-environment#redis)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

  ```bash
  npm install medusa-plugin-economic
  ```

2\. Set the following environment variables in `.env`:

  ```bash
  ECONOMIC_SECRET_TOKEN=<YOUR_SECRET_TOKEN>
  ECONOMIC_AGREEMENT_TOKEN=<YOUR_AGREEMENT_TOKEN>
  ECONOMIC_CUSTOMER_NUMBER_DK=<YOUR_CUSTOMER_NUMBER_DK>
  ECONOMIC_CUSTOMER_NUMBER_EU=<YOUR_CUSTOMER_NUMBER_EU>
  ECONOMIC_CUSTOMER_NUMBER_WORLD=<YOUR_CUSTOMER_NUMBER_WORLD>
  ECONOMIC_UNIT_NUMBER=<YOUR_UNIT_NUMBER>
  ECONOMIC_PAYMENT_TERMS_NUMBER=<YOUR_PAYMENT_TERMS_NUMBER>
  ECONOMIC_LAYOUT_NUMBER=<YOUR_LAYOUT_NUMBER>
  ECONOMIC_VATZONE_NUMBER_DK=<YOUR_VATZONE_NUMBER_DK>
  ECONOMIC_VATZONE_NUMBER_EU=<YOUR_VATZONE_NUMBER_EU>
  ECONOMIC_VATZONE_NUMBER_WORLD=<YOUR_VATZONE_NUMBER_WORLD>
  ECONOMIC_RECIPIENT_NAME=<YOUR_RECIPIENT_NAME>
  ```

3\. In `medusa-config.js` add the following at the end of the `plugins` array:

  ```js
  const plugins = [
    // other plugins...
    {
      resolve: `medusa-plugin-economic`,
      options: {
        secret_token: process.env.ECONOMIC_SECRET_TOKEN,
        agreement_token: process.env.ECONOMIC_AGREEMENT_TOKEN,
        customer_number_dk: process.env.ECONOMIC_CUSTOMER_NUMBER_DK,
        customer_number_eu: process.env.ECONOMIC_CUSTOMER_NUMBER_EU,
        customer_number_world: process.env.ECONOMIC_CUSTOMER_NUMBER_WORLD,
        unit_number: process.env.ECONOMIC_UNIT_NUMBER,
        payment_terms_number: process.env.ECONOMIC_PAYMENT_TERMS_NUMBER,
        layout_number: process.env.ECONOMIC_LAYOUT_NUMBER,
        vatzone_number_dk: process.env.ECONOMIC_VATZONE_NUMBER_DK,
        vatzone_number_eu: process.env.ECONOMIC_VATZONE_NUMBER_EU,
        vatzone_number_world: process.env.ECONOMIC_VATZONE_NUMBER_WORLD,
        recipient_name: process.env.ECONOMIC_RECIPIENT_NAME,
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

2\. Try creating an order using the storefront or the [Store APIs](https://docs.medusajs.com/api/store#tag/Cart). Once the order is placed, a draft invoice will be created in e-conomic.
