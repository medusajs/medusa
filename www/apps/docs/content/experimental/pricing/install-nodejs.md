# Install in Node.js-Based Application

In this document, you’ll learn how to setup and use the Pricing Module in a Node.js based application.

## Prerequisites

Before installing the Pricing Module in your application, make sure you have the following prerequisites:

- Node.js v16 or greater
- PostgreSQL database. You can use an existing Medusa database, or set up a new PostgreSQL database.

---

## Install Package

In your Node.js-based applications, such as a Next.js application, you can install the Pricing Module with the following command:

```bash npm2yarn
npm install @medusajs/pricing
```

---

## Add Database Configuration

Add the following environment variable to your application:

```bash
POSTGRES_URL=<DATABASE_URL>
```

Where `<DATABASE_URL>` is your database connection URL of the format `postgres://[user][:password]@[host][:port]/[dbname]`. You can learn more about the connection URL format in [this guide](../../references/medusa_config/interfaces/medusa_config.ConfigModule.mdx#database_url).

You can also set the following optional environment variables:

- `POSTGRES_SCHEMA`: a string indicating the PostgreSQL schema to use. By default, it's `public`.
- `POSTGRES_DRIVER_OPTIONS`: a stringified JSON object indicating the PostgreSQL options to use. The JSON object is then parsed to be used as a JavaScript object. By default, it's `{"connection":{"ssl":false}}` for local PostgreSQL databases, and `{"connection":{"ssl":{"rejectUnauthorized":false}}}` for remote databases.

:::note

If `POSTGRES_DRIVER_OPTIONS` is not specified, the PostgreSQL database is considered local if `POSTGRES_URL` includes `localhost`. Otherwise, it's considered remote.

:::

### Run Database Migrations

:::note

You can skip this step if you use an existing Medusa database.

:::

Migrations are used to create your database schema. Before you can run migrations, add in your `package.json` the following scripts:

```json
"scripts": {
  //...other scripts
  "price:migrations:run": "medusa-pricing-migrations-up",
  "price:seed": "medusa-pricing-seed ./pricing-seed-data.js"
},

```

The first command runs the migrations, and the second command allows you to seed your database with demo prices optionally.

However, you’d need the following seed file added to the root of your project directory:

<Details>
  <Summary>Seed file</Summary>

  ```js
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

</Details>

Then run the commands you added to migrate the database schema and optionally seed data:

```bash npm2yarn
npm run price:migrations:run
# optionally
npm run price:seed
```

---

## Next.js Application: Adjust Configurations

The Pricing Module uses dependencies that aren’t Webpack optimized. Since Next.js uses Webpack for compilation, you need to add the Pricing Module as an external dependency.

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

---

## Start Development

You can refer to the [Example Usages documentation page](./examples.mdx) for examples of using the Pricing Module.

You can also refer to the [Module Interface Reference](../../references/pricing/interfaces/pricing.IPricingModuleService.mdx) for a detailed reference on all available methods.