# MeiliSearch

Provide powerful indexing and searching features in your commerce application with MeiliSearch.

[MeiliSearch Plugin Documentation](https://docs.medusajs.com/plugins/search/meilisearch) | [Medusa Website](https://medusajs.com) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Flexible configurations for specifying searchable and retrievable attributes.
- Ready-integration with [Medusa's Next.js starter storefront](https://docs.medusajs.com/starters/nextjs-medusa-starter).
- Utilize MeiliSearch's powerful search functionalities including typo-tolerance, synonyms, filtering, and more.

---

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install)
- [MeiliSearch instance](https://docs.meilisearch.com/learn/getting_started/quick_start.html#setup-and-installation)

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

  ```bash
  npm install medusa-plugin-meilisearch
  ```

2\. Set the following environment variables in `.env`:

  ```bash
  MEILISEARCH_HOST=<YOUR_MEILISEARCH_HOST>
  MEILISEARCH_API_KEY=<YOUR_MASTER_KEY>
  ```

3\. In `medusa-config.js` add the following at the end of the `plugins` array:

  ```js
  const plugins = [
    // ...
    {
      resolve: `medusa-plugin-meilisearch`,
      options: {
        config: {
          host: process.env.MEILISEARCH_HOST,
          apiKey: process.env.MEILISEARCH_API_KEY,
        },
        settings: {
          products: {
            indexSettings: {
              searchableAttributes: [
                "title", 
                "description",
                "variant_sku",
              ],
              displayedAttributes: [
                "title", 
                "description", 
                "variant_sku", 
                "thumbnail", 
                "handle",
              ],
            },
            primaryKey: "id",
            transform: (product) => ({ 
              id: product.id, 
              // other attributes...
            }),
          },
        },
      },
    },
  ]
  ```

---

## Test the Plugin

1\. Run the following command in the directory of the Medusa backend to run the backend:

  ```bash
  npm run start
  ```

2\. Try searching products either using your storefront or using the [Store APIs](https://docs.medusajs.com/api/store#tag/Product/operation/PostProductsSearch).

---

## Additional Resources

- [MeiliSearch Plugin Documentation](https://docs.medusajs.com/plugins/search/meilisearch)
