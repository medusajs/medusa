# Shopify Source

Migrate your products and categories from Shopify to Medusa.

[Medusa Website](https://medusajs.com) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Migrate data related to products from Shopify to Medusa.
- Consistently keep data in sync between Shopify and Medusa.

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)
- [Shopify account](https://shopify.dev/)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

  ```bash
  npm install medusa-source-shopify
  ```

2\. Set the following environment variable in `.env`:

  ```bash
  SHOPIFY_DOMAIN=<YOUR_SHOPIFY_DOMAIN>
  SHOPIFY_PASSWORD=<YOUR_SHOPIFY_PASSWORD>
  ```

3\. In `medusa-config.js` add the following at the end of the `plugins` array:

  ```js
  const plugins = [
    // ...,
    {
      resolve: 'medusa-source-shopify',
      options: {
        domain: process.env.SHOPIFY_DOMAIN,
        password: process.env.SHOPIFY_PASSWORD
      }
    }
  ];
  ```

---

## Test the Plugin

1\. Run the following command in the directory of the Medusa backend to run the backend:

  ```bash
  npm run start
  ```

2\. The data migration runs on server start-up. You should see your Shopify products in Medusa.