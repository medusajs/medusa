# Product Module

The Product Module gives you access Products, Variants, Categories, and more through a standalone package that can be installed and run in Next.js functions and other Node.js compatible runtimes.

[Product Module documentation](https://docs.medusajs.com/modules/product/serverless-module) | [Medusa Website](https://medusajs.com/) | [Medusa Repository](https://github.com/medusajs/medusa)

> The Product Module is currently in beta. The beta version comes with limited functionality, primarily centered around retrieving products. In the official version, the product module will be fully-fledged and on par with the product functionality in our core package.

---

## Installing and using it in Next.js

### Prerequisites

- [Next.js project](https://nextjs.org/docs/pages/api-reference/create-next-app)

1\. Run the following command in your project

```bash
npm install @medusajs/product
```

2\. Add Database URL to your environment variables

```bash
POSTGRES_URL=<DATABASE_URL>
```

3\. Apply database migrations

> If you are using an existing Medusa database, you can skip this step. This step is only applicable when the module is used in isolation from a full Medusa setup

Before you can run migrations, add in your `package.json` the following scripts:

```json
"scripts": {
    //...other scripts
    "product:migrations:run": "medusa-product-migrations-up",
    "product:seed": "medusa-product-seed ./seed-data.js"
},
```

The first command runs the migrations, and the second command allows you to optionally seed your database with demo products.

For the second command to work, you'll need to add the dummy seed data to the root of your Next.js project:

<details>
  <summary>Seed file</summary>

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
  },
  {
    id: "test-2",
    title: "variant title",
    sku: "sku 2",
    product: { id: productsData[1].id },
  },
]

module.exports = {
  productCategoriesData,
  productsData,
  variantsData,
}
```

</details>

Then run the first and optionally the second command to migrate and seed the database:

```bash
npm run product:migrations:run
# optionally
npm run product:seed
```

4\. Adjust Next.js config

Next.js uses Webpack for compilation. Since quite a few of the dependencies used by the product module are not Webpack optimized, you have to add the product module as an external dependency.

To do that, add the serverComponentsExternalPackages option in `next.config.js`:

```js
/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@medusajs/product"],
  },
}

module.exports = nextConfig
```

5\. Create API Route

The product module is ready for use now! You can now use it to create API endpoints within your Next.js application.

For example, create the file `app/api/products/route.ts` with the following content:

```ts
import { NextResponse } from "next/server"

import { initialize as initializeProductModule } from "@medusajs/product"

export async function GET(request: Request) {
  const productService = await initializeProductModule()

  const data = await productService.list()

  return NextResponse.json({ products: data })
}
```

6\. Test your Next.js application
To test the endpoint you added, start your Next.js application with the following command:

```
npm run dev
```

Then, open in your browser the URL `http://localhost:3000/api/products`. If you seeded your database with demo products, or you’re using a Medusa database schema, you’ll receive the products in your database. Otherwise, the request will return an empty array.
