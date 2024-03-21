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

In `medusa-config.js`, add the Inventory Module to the exported object under the `modules` property:

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
npx medusa migrations run
```

### Step 4: Run Migration Script

After installing the Stock Location Module, make sure to [run the migration script](#run-migration-script)

---

## Stock Location Module

### Step 1: Install Stock Location Module

To install the Stock Location Module, run the following command in the root directory of the Medusa backend:

```bash npm2yarn
npm install @medusajs/stock-location
```

### Step 2: Add Stock Location Module to Configurations

In `medusa-config.js`, add the Stock Location Module to the exported object under the `modules` property:

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
npx medusa migrations run
```

### Step 4: Run Migration Script

After installing both modules, make sure to [run the migration script](#run-migration-script)

---

## Run Migration Script

After installing both modules, run the following command to migrate current product variant information to fit the schema changes introduced by the modules:

```bash
node ./node_modules/@medusajs/medusa/dist/scripts/migrate-inventory-items.js
```

You can now start the Medusa backend and use the Stock Location Module in your commerce application.
