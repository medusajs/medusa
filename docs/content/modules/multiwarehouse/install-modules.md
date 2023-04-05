---
description: "In this document, you’ll learn how to install multi-warehouse related modules using NPM in the Medusa backend."
---

# Install Multi-Warehouse Modules

In this document, you’ll learn how to install multi-warehouse related modules using NPM in the Medusa backend.

:::tip

You can also install these modules in any NPM project.

:::

## Inventory Module

### Step 1: Install Inventory Module

To install the Inventory Module, run the following command in the root directory of the Medusa backend:

```bash npm2yarn
npm install @medusajs/inventory
```

### Step 2: Add Inventory Module to Configurations

In `medusa-config.js`, add the inventory module to the exported object under the `modules` property:

```js
module.exports = {
  // ...
  modules: {
    // ...
    inventoryService: {
      resolve: "@medusajs/inventory",
    },
  },
}
```

### Step 3: Run Migrations of Inventory Module

Run the following command to reflect schema changes into your database:

```bash
medusa migrations run
```

You can now start the Medusa backend and use the inventory module in your commerce application.

---

## Stock Location Module

### Step 1: Install Stock Location Module

To install the Stock Location Module, run the following command in the root directory of the Medusa backend:

```bash npm2yarn
npm install @medusajs/stock-location
```

### Step 2: Add Stock Location Module to Configurations

In `medusa-config.js`, add the stock location module to the exported object under the `modules` property:

```js
module.exports = {
  // ...
  modules: {
    // ...
    stockLocationService: {
      resolve: "@medusajs/stock-location",
    },
  },
}
```

### Step 3: Run Migrations of Stock Location Module

Run the following command to reflect schema changes into your database:

```bash
medusa migrations run
```

You can now start the Medusa backend and use the stock location module in your commerce application.
