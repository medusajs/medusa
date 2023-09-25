---
title: 'How to Use Serverless Pricing Module'
description: 'Learn how to use the Pricing module in a serverless setup by installing it in a Next.js application.'
addHowToData: true
badge:
  variant: orange
  text: beta
---

In this document, you’ll learn how to use the Pricing Module in a serverless setup.

## Overview

Medusa’s modules increase extensibility and customization capabilities. Instead of having to manage a fully-fledged ecommerce system, you can use these modules in serverless applications, such as a Next.js project.

The Pricing Module allows you to utilize price-related features within a serverless setup, such as a Next.js project. It only needs to connect to a PostgreSQL database, where the data will be stored.

### Benefits of Serverless Modules

- Keep packages small enough to be deployed to serverless Infrastructure easily
- Bring Medusa closer to Edge runtime compatibility.
- Make it easier to integrate modules into an ecosystem of existing commerce services.
- Make it easier to customize or extend core logic in Medusa.

### Example Scenarios

Some use cases where you can use the pricing module:

1. Connect it to an existing Medusa database for more flexibility when creating a storefront.
2. Use it with custom commerce functionalities to provide pricing features. You can also use it with other serverless modules, such as the [product module](../products/serverless-module.md).

---

## Prerequisites

- The Pricing Module requires a project using Node v16+.
- The Pricing Module must connect to a PostgreSQL database. You can refer to [this guide](https://docs.medusajs.com/development/backend/prepare-environment#postgresql) to learn how to install PostgreSQL locally. Alternatively, you can use free PostgreSQL database hosting, such as [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres). If you have an existing Medusa database, you can use it as well.

---

## Installation in Next.js Project

This section explains how to install the Pricing module in a Next.js project.

If you don’t have a Next.js project, you can create one with the following command:

```bash
npx create-next-app@latest
```

Refer to the [Next.js documentation](https://nextjs.org/docs/getting-started/installation) for other available installation options.

### Step 1: Install the Pricing Module

In the root directory of your Next.js project, run the following command to install the Pricing module:

```bash npm2yarn
npm install @medusajs/pricing
```

### Step 2: Add Database Configurations

Create a `.env` file and add the following environment variable:

```bash
POSTGRES_URL=<DATABASE_URL>
```

Where `<DATABASE_URL>` is your database connection URL of the format `postgres://[user][:password]@[host][:port]/[dbname]`. You can learn more about the connection URL format in [this guide](../../development/backend/configurations.md#database_url).

You can also set the following optional environment variables:

- `POSTGRES_SCHEMA`: a string indicating the PostgreSQL schema to use. By default, it's `public`.
- `POSTGRES_DRIVER_OPTIONS`: a stringified JSON object indicating the PostgreSQL options to use. The JSON object is then parsed to be used as a JavaScript object. By default, it's `{"connection":{"ssl":false}}` for local PostgreSQL databases, and `{"connection":{"ssl":{"rejectUnauthorized":false}}}` for remote databases.

:::tip

If `POSTGRES_DRIVER_OPTIONS` is not specified, the PostgreSQL database is considered local if `POSTGRES_URL` includes `localhost`. Otherwise, it's considered remote.

:::

### Step 3: Run Database Migrations

:::note

If you are using an existing Medusa database, you can skip this step.

:::

Migrations are used to create your database schema. Before you can run migrations, add in your `package.json` the following scripts:

```json title=package.json
"scripts": {
  //...other scripts
  "price:migrations:run": "medusa-pricing-migrations-up",
  "price:seed": "medusa-pricing-seed ./pricing-seed-data.js"
},
```

The first command runs the migrations, and the second command allows you to optionally seed your database with demo prices. However, you’d need the following seed file added to the root of your Next.js directory:

<details>
<summary>
Seed file
</summary>

```js title=pricing-seed-data.js
const currenciesData = [
  {
    code: "USD",
    symbol: "$",
    symbol_native: "$",
    name: "US Dollar",
  },
  {
    code: "CAD",
    symbol: "CA$",
    symbol_native: "$",
    name: "Canadian Dollar",
  },
  {
    code: "EUR",
    symbol: "€",
    symbol_native: "€",
    name: "Euro",
  },
]

const moneyAmountsData = [
  {
    id: "money-amount-USD",
    currency_code: "USD",
    amount: 500,
    min_quantity: 1,
    max_quantity: 10,
  },
  {
    id: "money-amount-EUR",
    currency_code: "EUR",
    amount: 400,
    min_quantity: 1,
    max_quantity: 5,
  },
  {
    id: "money-amount-CAD",
    currency_code: "CAD",
    amount: 600,
    min_quantity: 1,
    max_quantity: 8,
  },
]

const priceSetsData = [
  {
    id: "price-set-USD",
  },
  {
    id: "price-set-EUR",
  },
  {
    id: "price-set-CAD",
  },
]

const priceSetMoneyAmountsData = [
  {
    title: "USD Price Set",
    price_set: "price-set-USD",
    money_amount: "money-amount-USD",
  },
  {
    title: "EUR Price Set",
    price_set: "price-set-EUR",
    money_amount: "money-amount-EUR",
  },
]

module.exports = {
  currenciesData,
  moneyAmountsData,
  priceSetsData,
  priceSetMoneyAmountsData,
}
```

</details>

Then run the first and optionally second commands to migrate the database schema:

```bash
npm run price:migrations:run
# optionally
npm run price:seed
```

### Step 4: Adjust Next.js Configurations

Next.js uses Webpack for compilation. Since quite a few of the dependencies used by the pricing module are not Webpack optimized, you have to add the Pricing module as an external dependency.

To do that, add the `serverComponentsExternalPackages` option in `next.config.js`:

```js title=next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "@medusajs/pricing",
    ],
  },
}

module.exports = nextConfig
```

### Step 5: Create API Route

The Pricing module is ready for use now! You can now use it to create API endpoints within your Next.js application.

:::tip

This guide uses Next.js's App Router.

:::

For example, create the file `app/api/prices/route.ts` with the following content:

```ts title=app/api/prices/route.ts
import { NextResponse } from "next/server"

import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

export async function GET(request: Request) {
  const pricingService = await initializePricingModule()

  const prices = await pricingService.list()

  return NextResponse.json({ prices })
}
```

This creates a `GET` endpoint at the route `/api/prices`. You import the `initialize` function aliased as `initializePricingModule` from `@medusajs/pricing`. Then, in the endpoint, you invoke the initializePricingModule function, which returns an instance of the `PricingModuleService`.

Using the `PricingModuleService`'s `list` method, you retrieve all prices and return them in the response of the endpoint.

### Step 6: Test Next.js Application

To test the endpoint you added, start your Next.js application with the following command:

```bash npm2yarn
npm run dev
```

Then, open in your browser the URL `http://localhost:3000/api/prices`. If you seeded your database with demo prices, or you’re using a Medusa database schema, you’ll receive the prices in your database. Otherwise, the request will return an empty array.

---

## Example Usages

This section includes examples of the different functionalities or ways you can use the Pricing module. The code snippets are shown in the context of endpoints.

### Retrieve a Price by its ID

```ts title=app/api/prices/[id]/route.ts
import { NextResponse } from "next/server"

import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

type ContextType = {
  params: {
    id: string
  }
}

export async function GET(
  request: Request,
  { params }: ContextType
) {
  const pricingService = await initializePricingModule()

  const price = await pricingService.retrieve(params.id)

  return NextResponse.json({ price })
}
```

### Calculate Prices For a Currency

```ts title=app/api/prices/[id]/[currency_code]/route.ts
import { NextResponse } from "next/server"

import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

type ContextType = {
  params: {
    id: string
    currency_code: string
  }
}

export async function GET(
  request: Request,
  { params }: ContextType
) {
  const pricingService = await initializePricingModule()

  const price = await pricingService.calculatePrices({
    id: [params.id],
  }, {
    context: {
      currency_code: params.currency_code,
    },
  })

  return NextResponse.json({ price })
}
```

### Create a Price

```ts title=app/api/prices/route.ts
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

export async function POST(request: Request) {
  const pricingService = await initializePricingModule()
  const body = await request.json()

  const price = await pricingService.create([
    {
      money_amounts: [
        {
          // TODO generate a random ID
          id: uuidv4(),
          currency_code: body.currency_code,
          amount: body.amount,
        },
      ],
    },
  ])

  return NextResponse.json({ price })
}
```

### Create a Currency

```ts title=app/api/prices/currencies/route.ts
import { NextResponse } from "next/server"

import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

export async function POST(request: Request) {
  const pricingService = await initializePricingModule()
  const body = await request.json()

  const currencies = await pricingService.createCurrencies([{
    code: "EUR",
    symbol: "€",
    symbol_native: "€",
    name: "Euro",
  }])

  return NextResponse.json({ currencies })
}
```

### List Currencies

```ts title=app/api/prices/currencies/route.ts
import { NextResponse } from "next/server"

import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

export async function GET(request: Request) {
  const pricingService = await initializePricingModule()

  const currencies = await pricingService.listCurrencies()

  return NextResponse.json({ currencies })
}
```

---

## See Also

- [Pricing Commerce Module Overview](./overview.mdx)
