---
title: 'How to Use Serverless Product Module'
description: 'Learn how to use the product module in a serverless setup by installing it in a Next.js application.'
addHowToData: true
badge:
  variant: orange
  text: beta
---

In this document, you’ll learn how to use the Product module in a serverless setup.

## Overview

Medusa’s modules increase extensibility and customization capabilities. Instead of having to manage a fully-fledged ecommerce system, you can use these modules in serverless applications, such as a Next.js project.

The module only needs to connect to a PostgreSQL database. You can also connect it to an existing Medusa database. Then, you can use the Product module to connect directly to the PostgreSQL database and retrieve or manipulate data.

This guide explains how to use the Product Module in a Next.js application as an example. You can use it with other frameworks, such as Remix, as well.

### Benefits of Serverless Modules

- Keep packages small enough to be deployed to serverless Infrastructure easily
- Bring Medusa closer to Edge runtime compatibility.
- Make it easier to integrate modules into an ecosystem of existing commerce services.
- Make it easier to customize or extend core logic in Medusa.

:::info

The product module is currently in beta, and it provides only functionalities related to browsing products. In later versions, the product module would include more powerful ecommerce features.

:::

---

## Prerequisites

- The Product Module requires a project using Node v16+.
- The Product Module must connect to a PostgreSQL database. You can refer to [this guide](../../development/backend/prepare-environment.mdx#postgresql) to learn how to install PostgreSQL locally. Alternatively, you can use free PostgreSQL database hosting, such as [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres). If you have an existing Medusa database, you can use it as well.

---

## Installation in Next.js Project

This section explains how to install the Product module in a Next.js project.

If you don’t have a Next.js project, you can create one with the following command:

```bash
npx create-next-app@latest
```

Refer to the [Next.js documentation](https://nextjs.org/docs/getting-started/installation) for other available installation options.

### Step 1: Install Product Module

In the root directory of your Next.js project, run the following command to install the product module:

```bash npm2yarn
npm install @medusajs/product
```

### Step 2: Add Database Configurations

Create a `.env` file and add the following environment variable:

```bash
POSTGRES_URL=<DATABASE_URL>
```

Where `<DATABASE_URL>` is your database connection URL of the format `postgres://[user][:password]@[host][:port]/[dbname]`. You can learn more about the connection URL format in [this guide](../../development/backend/configurations.md#postgresql-configurations).

You can also set the following optional environment variables:

- `POSTGRES_SCHEMA`: a string indicating the PostgreSQL schema to use. By default, it's `public`.
- `POSTGRES_DRIVER_OPTIONS`: a stringified JSON object indicating the PostgreSQL options to use. The JSON object is then parsed to be used as a JavaScript object. By default, it's `{"connection":{"ssl":false}}` for local PostgreSQL databases, and `{"connection":{"ssl":{"rejectUnauthorized":false}}}` for remote databases.

:::note

If `POSTGRES_DRIVER_OPTIONS` is not specified, the PostgreSQL database is considered local if `POSTGRES_URL` includes `localhost`. Otherwise, it's considered remote.

:::

### Step 3: Run Database Migrations

:::note

If you are using an existing Medusa database, you can skip this step.

:::

Migrations are used to create your database schema. Before you can run migrations, add in your `package.json` the following scripts:

```json title=package.json
"scripts": {
  //...other scripts
  "product:migrations:run": "medusa-product-migrations-up",
  "product:seed": "medusa-product-seed ./seed-data.js"
},
```

The first command runs the migrations, and the second command allows you to optionally seed your database with demo products. However, you’d need the following seed file added in the root of your Next.js directory:

<details>
  <summary>Seed file</summary>

  ```js title=seed-data.js
  const productCategoriesData = [
    {
      id: "category-0",
      name: "category 0",
      parent_category_id: null,
    },
    {
      id: "category-1",
      name: "category 1",
      parent_category_id: "category-0",
    },
    {
      id: "category-1-a",
      name: "category 1 a",
      parent_category_id: "category-1",
    },
    {
      id: "category-1-b",
      name: "category 1 b",
      parent_category_id: "category-1",
      is_internal: true,
    },
    {
      id: "category-1-b-1",
      name: "category 1 b 1",
      parent_category_id: "category-1-b",
    },
  ]
  
  const productsData = [
    {
      id: "test-1",
      title: "product 1",
      status: "published",
      descriptions: "Lorem ipsum dolor sit amet, consectetur.",
      tags: [
        {
          id: "tag-1",
          value: "France",
        },
      ],
      categories: [
        {
          id: "category-0",
        },
      ],
    },
    {
      id: "test-2",
      title: "product",
      status: "published",
      descriptions: "Lorem ipsum dolor sit amet, consectetur.",
      tags: [
        {
          id: "tag-2",
          value: "Germany",
        },
      ],
      categories: [
        {
          id: "category-1",
        },
      ],
    },
  ]
  
  const variantsData = [
    {
      id: "test-1",
      title: "variant title",
      sku: "sku 1",
      product: { id: productsData[0].id },
      inventory_quantity: 10,
    },
    {
      id: "test-2",
      title: "variant title",
      sku: "sku 2",
      product: { id: productsData[1].id },
      inventory_quantity: 10,
    },
  ]
  
  module.exports = {
    productCategoriesData,
    productsData,
    variantsData,
  }
  ```

</details>

Then run the first and optionally second commands to migrate the database schema:

```bash npm2yarn
npm run product:migrations:run
# optionally
npm run product:seed
```

### Step 4: Adjust Next.js Configurations

Next.js uses Webpack for compilation. Since quite a few of the dependencies used by the product module are not Webpack optimized, you have to add the product module as an external dependency.

To do that, add the `serverComponentsExternalPackages` option in `next.config.js`:

```js title=next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "@medusajs/product",
    ],
  },
}

module.exports = nextConfig
```

### Step 5: Create API Route

The product module is ready for use now! You can now use it to create API endpoints within your Next.js application.

:::note

This guide uses Next.js's App Router.

:::

For example, create the file `app/api/products/route.ts` with the following content:

```ts title=app/api/products/route.ts
import { NextResponse } from "next/server"

import { 
  initialize as initializeProductModule,
} from "@medusajs/product"

export async function GET(request: Request) {
  const productService = await initializeProductModule()

  const data = await productService.list()

  return NextResponse.json({ products: data })
}
```

This creates a `GET` endpoint at the route `/api/products`. You import the `initialize` function, aliased as `initializeProductModule`, from `@medusajs/product`. Then, in the endpoint, you invoke the `initializeProductModule` function, which returns an instance of the `ProductModuleService`. Using the product module service’s `list` method, you retrieve all available products and return them in the response of the endpoint.

### Step 6: Test Next.js Application

To test the endpoint you added, start your Next.js application with the following command:

```bash npm2yarn
npm run dev
```

Then, open in your browser the URL `http://localhost:3000/api/products`. If you seeded your database with demo products, or you’re using a Medusa database schema, you’ll receive the products in your database. Otherwise, the request will return an empty array.

---

## Example Usages

This section includes some examples of the different functionalities or ways you can use the product module. The code snippets are shown in the context of endpoints.

### List Products

```ts title=app/api/products/route.ts
import { NextResponse } from "next/server"

import { 
  initialize as initializeProductModule,
} from "@medusajs/product"

export async function GET(request: Request) {
  const productService = await initializeProductModule()

  const data = await productService.list()

  return NextResponse.json({ products: data })
}
```

### Retrieve Product by Id

```ts title=app/api/product/[id]/route.ts
import { NextResponse } from "next/server"

import { 
  initialize as initializeProductModule,
} from "@medusajs/product"

export async function GET(
  request: Request, 
  { params }: { params: Record<string, any> }) {
  
  const { id } = params
  const productService = await initializeProductModule()

  const data = await productService.list({
    id,
  })

  return NextResponse.json({ product: data[0] })
}
```

### Retrieve Product by Handle

```ts title=app/api/product/[handle]/route.ts
import { NextResponse } from "next/server"

import { 
  initialize as initializeProductModule,
} from "@medusajs/product"

export async function GET(
  request: Request, 
  { params }: { params: Record<string, any> }) {
  
  const { handle } = params
  const productService = await initializeProductModule()

  const data = await productService.list({
    handle,
  })

  return NextResponse.json({ product: data[0] })
}
```

### Retrieve Categories

```ts title=app/api/categories/route.ts
import { NextResponse } from "next/server"

import { 
  initialize as initializeProductModule,
} from "@medusajs/product"

export async function GET(request: Request) {
  const productService = await initializeProductModule()

  const data = await productService.listCategories()

  return NextResponse.json({ categories: data })
}
```

### Retrieve Category by Handle

```ts title=app/api/category/[handle]/route.ts
import { NextResponse } from "next/server"

import { 
  initialize as initializeProductModule,
} from "@medusajs/product"

export async function GET(
  request: Request, 
  { params }: { params: Record<string, any> }) {
  
  const { handle } = params
  const productService = await initializeProductModule()

  const data = await productService.listCategories({
    handle,
  })

  return NextResponse.json({ category: data[0] })
}
```

---

## See Also

- [Products Commerce Module Overview](./overview.mdx)
- [How to show products in a storefront](./storefront/show-products.mdx)
- [How to show categories in a storefront](./storefront/use-categories.mdx)
