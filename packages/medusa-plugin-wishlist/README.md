# Wishlist

Add wishlist capabilities to your commerce application.

[Medusa Website](https://medusajs.com) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Allow customers to manage items in their wishlist.

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

  ```bash
  npm install medusa-plugin-wishlist
  ```

2\. In `medusa-config.js` add the following at the end of the `plugins` array:

  ```js
  const plugins = [
    // ...
    `medusa-plugin-wishlist`
  ]
  ```

---

## Test the Plugin

Learn about testing the plugin in [the documentation](https://docs.medusajs.com/plugins/other/wishlist)
