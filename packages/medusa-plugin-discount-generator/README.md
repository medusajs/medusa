# Discount Generator

Generate dynamic discount codes in your Medusa backend.

[Medusa Website](https://medusajs.com/) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Provides a service that can be used to generate a dynamic discount with a random code.
- Provides an endpoint that can be used to generate a dynamic discount with a random code.

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

  ```bash
  npm install medusa-plugin-discount-generator
  ```

2\. In `medusa-config.js` add the following at the end of the `plugins` array:

  ```js
  const plugins = [
    // ...
    `medusa-plugin-discount-generator`
  ]
  ```

---

## Test the Plugin

Try using the `DiscountGeneratorService` in your code, or using the `/discount-code` endpoint to generate a random discount code.
