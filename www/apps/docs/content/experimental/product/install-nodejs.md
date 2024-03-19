# Install in Node.js-Based Application

In this document, you’ll learn how to setup and use the Product Module in a Node.js based application.

## Prerequisites

Before installing the Product Module in your application, make sure you have the following prerequisites:

- Node.js v16 or greater
- PostgreSQL database. You can use an existing Medusa database, or set up a new PostgreSQL database.

---

## Install Package

In your Node.js-based applications, such as a Next.js application, you can install the Product Module with the following command:

```bash npm2yarn
npm install @medusajs/product
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
  "product:migrations:run": "medusa-product-migrations-up",
  "product:seed": "medusa-product-seed ./seed-data.js"
}
```

The first command runs the migrations, and the second command allows you to seed your database with demo products optionally.

However, you’d need the following seed file added to the root of your project directory:

<Details>
  <Summary>Seed File</Summary>

    ```js
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

</Details>

Then run the commands you added to migrate the database schema and optionally seed data:

```bash npm2yarn
npm run product:migrations:run
# optionally
npm run product:seed
```

---

## Next.js Application: Adjust Configurations

the Product Module uses dependencies that aren’t Webpack optimized. Since Next.js uses Webpack for compilation, you need to add the Product Module as an external dependency.

To do that, add the `serverComponentsExternalPackages` option in `next.config.js`:

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

---

## Start Development

You can refer to the [Example Usages documentation page](./examples.mdx) for examples of using the Product Module.

You can also refer to the [Module Interface Reference](../../references/product/interfaces/product.IProductModuleService.mdx) for a detailed reference on all available methods.
