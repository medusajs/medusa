---
description: 'Learn how to use the Multi-warehouse modules in a serverless setup by installing it in a Next.js application.'
addHowToData: true
---

# Serverless Multi-warehouse Modules

In this document, you’ll learn how to use the Multi-warehouse modules in a serverless setup.

## Overview

Medusa’s modules increase extensibility and customization capabilities. The Multi-warehouse modules, `@medusajs/inventory` and `@medusajs/stock-location`, can be used in a serverless application without having to connect to a Medusa backend.

The modules only need to connect to an existing Medusa PostgreSQL database. Then, you can use the services exposed by the Inventory and Stock Locations modules to retrieve and manipulate data directly from the database.

This guide explains how to use the Inventory and Stock Locations Modules in a Next.js application as an example.

### Benefits of Serverless Modules

- Keep packages small enough to be deployed to serverless Infrastructure easily
- Bring Medusa closer to Edge runtime compatibility.
- Make it easier to integrate modules into an ecosystem of existing commerce services.
- Make it easier to customize or extend core logic in Medusa.

---

## Prerequisites

- The Inventory and Stock Location Modules require a project using [Node v16+](../../development/backend/prepare-environment.mdx#nodejs).
- The modules must connect to a Medusa PostgreSQL database. If you have a Medusa project, you can grab the value of the `DATABASE_URL` environment variable. If you don’t have a Medusa project, you can learn [how to create a Medusa project here](../../create-medusa-app.mdx).

---

## Installation in Next.js Project

This section explains how to install the modules in a Next.js project.

If you don’t have a Next.js project, you can create one with the following command:

```bash
npx create-next-app@latest
```

Refer to the [Next.js documentation](https://nextjs.org/docs/getting-started/installation) for other available installation options.

### Step 1: Install Modules

In the root directory of your Next.js project, run the following commands to install the modules and their required dependencies:

```bash npm2yarn
npm install @medusajs/inventory @medusajs/stock-location pg
```

The `pg` package is used to connect to the PostgreSQL database.

### Step 2: Add Database Configurations

In `.env`, add the following environment variable:

```bash
POSTGRES_URL=<DATABASE_URL>
```

Where `<DATABASE_URL>` is your database connection URL of the format `postgres://[user][:password]@[host][:port]/[dbname]`. You can learn more about the connection URL format in [this guide](https://www.notion.so/development/backend/configurations.md#postgresql-configurations).

### Step 3: Adjust Next.js Configurations

Next.js uses Webpack for compilation. Since quite a few of the dependencies used by the modules are not Webpack optimized, you have to add the modules as external dependencies.

To do that, add the `serverComponentsExternalPackages` option in `next.config.js`:

```js title=next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "@medusajs/inventory",
      "@medusajs/stock-location",
    ],
  },
}

module.exports = nextConfig
```

### Step 4: Create API Route

The modules are ready for use now! You can now use it to create API endpoints within your Next.js application.

For example, create the file `app/api/inventory/route.ts` with the following content:

```ts title=app/api/inventory/route.ts
import {
  initialize as initializeInventory,
} from "@medusajs/inventory"
import { NextResponse } from "next/server"

const database = {
  url: process.env.DATABASE_URL,
  type: "postgres",
}

export async function GET() {
  const inventoryService = await initializeInventory({
    database,
  })

  const [levels] = await inventoryService.listInventoryLevels({

  })

  return NextResponse.json({ levels })
}
```

This creates a `GET` endpoint at the route `/api/inventory`. You import the `initialize` function, aliased as `initializeInventory`, from `@medusajs/inventory`. Then, in the endpoint, you invoke the `initializeInventory` function, which returns an instance of the `IInventoryService`. Using the service’s `list` method, you retrieve all available products and return them in the response of the endpoint.

You can use the stock location module similarly. For example, you can create another endpoint at `app/api/locations.route.ts` with the following content:

```ts title=app/api/locations.route.ts
import {
  initialize as initializeStockLocation,
} from "@medusajs/stock-location"
import { NextResponse } from "next/server"

const database = {
  url: process.env.DATABASE_URL,
  type: "postgres",
}

export async function GET() {
  const stockLocationService = await initializeStockLocation({
    database,
  })

  const locations = await stockLocationService.list({})

  return NextResponse.json({ locations })
}
```

### Step 5: Test Next.js Application

To test the endpoint you added, start your Next.js application with the following command:

```bash npm2yarn
npm run dev
```

Then, open in your browser the URL `http://localhost:3000/api/inventory`. If you have any inventory levels in your database, they’ll be returned within the response array. Otherwise, the array will be empty.

---

## Example Usages

This section includes some examples of the different functionalities or ways you can use the multi-warehouse modules. The code snippets are not used in a specific context (for example, in a Next.js API route).

Some parts, such as the database configuration options, are omitted for simplicity.

### Listing Inventory Levels

```ts
import {
  initialize as initializeInventory,
} from "@medusajs/inventory"
import {
  initialize as initializeStockLocation,
} from "@medusajs/stock-location"

const inventoryService = await initializeInventory({})

const stockLocationService = await initializeStockLocation({})

const [levels] = await inventoryService.listInventoryLevels(
  { inventory_item_id: variantInventoryItemId }
)
```

### Joining Locations

```ts
const stockLocations = await stockLocationService.list({
  id: levels.map((l) => l.location_id),
})

return {
  try_on_locations: stockLocations
    .filter((sl) => !!sl.metadata?.try_on),
}
```

### Creating a Reservation

```ts
const inventoryService = await initialize({})

// ...

await inventoryService.createReservationItem({
  location_id,
  inventory_item_id,
  metadata,
  description: "try on",
  quantity: 1,
})
```

---

## See Also

- [Multi-warehouse Commerce Modules Overview](./overview.mdx)
