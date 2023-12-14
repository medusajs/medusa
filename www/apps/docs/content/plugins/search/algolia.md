---
description: 'Learn how to integrate Algolia with the Medusa backend. Learn how to install the Algolia plugin into the Medusa backend and how to integrate it into a storefront.'
addHowToData: true
---

# Algolia

In this document, you’ll learn how to install the [Algolia plugin](https://github.com/medusajs/medusa/tree/master/packages/medusa-plugin-algolia) and use it on both your Medusa backend and your storefront.

---

## Overview

[Algolia](https://www.algolia.com/) is a search engine service that allows developers to integrate advanced search functionalities into their websites including typo tolerance, recommended results, and quick responses.

Algolia can be used for a wide range of use cases, including ecommerce websites. By integrating Algolia into your ecommerce website, you can provide your customers with a better user experience and help them find what they’re looking for swifltly.

Through Medusa's flexible plugin system, it is possible to add a search engine to your Medusa backend and storefront using Algolia with just a few steps.

---

## Prerequisites

### Medusa Components

It is required to have a Medusa backend installed before starting with this documentation. If not, please follow along with the [quickstart guide](../../development/backend/install.mdx) to get started in minutes. The Medusa backend must also have an event bus module installed, which is available when using the default Medusa backend starter.

### Algolia Account

You need to [create an Algolia account](https://www.algolia.com/users/sign_up) before you follow this documentation. Algolia offers a free plan to get started quickly.

---

## Create an Algolia App

The first step is to create an Algolia app for your Medusa backend. To create one, open the [Applications page](https://www.algolia.com/account/applications) or, on your dashboard, go to Settings then choose Applications.

On the Applications page, click on the New application button at the top right.

![Click on New application button at the top right](https://res.cloudinary.com/dza7lstvk/image/upload/v1667999820/Medusa%20Docs/Algolia/WxckgS2_eygl8l.png)

In the new page that opens, optionally enter a name for the application and choose a subscription plan. You can choose the Free plan for now, but it’s recommended to switch to the Pay-as-you-go plan as your business grows.

![Optionally enter a name for the application and choose a subscription plan](https://res.cloudinary.com/dza7lstvk/image/upload/v1667999980/Medusa%20Docs/Algolia/jpM2EBU_fui1lg.png)

Once you’re done, click on the Next Step button. If you picked Pay as you go service, you’ll need to enter billing details before you proceed.

Then, you’ll be asked to pick a region for your application. Once you’re done, click on Review Application Details.

![Select a region then click on Review Application Details at the bottom right](https://res.cloudinary.com/dza7lstvk/image/upload/v1668000005/Medusa%20Docs/Algolia/fahf2J2_qgm7sa.png)

In the last step, you’ll see a summary of your order. If all looks good, check the checkboxes at the end of the form to indicate that you agree to the terms and conditions. Then, click on the Create Application button.

![Summary of your application's order with the terms and agreement checkboxes checked](https://res.cloudinary.com/dza7lstvk/image/upload/v1668000019/Medusa%20Docs/Algolia/PTI2Swq_a1qbi5.png)

---

## Retrieve API Keys

To retrieve the API keys that you’ll use in the next sections, go to Settings, then choose API Keys in the Team and Access section.

![Click on API Keys in the Team and Access section of your settings](https://res.cloudinary.com/dza7lstvk/image/upload/v1668000028/Medusa%20Docs/Algolia/gnORibC_msuur5.png)

On this page, you’ll find the Application ID, Search-Only API Key, and Admin API Key. You’ll need the Application ID and Admin API Key for the Medusa backend. As for the storefront, you’ll need the Application ID and Search-Only API Key.

:::note

If you have more than one application in your Algolia account, make sure you’re viewing the keys of the correct application by checking the Application dropdown at the top left.

:::

![Application ID, Search-Only API Key, and Admin API Key can be found in the API Keys page](https://res.cloudinary.com/dza7lstvk/image/upload/v1668000037/Medusa%20Docs/Algolia/i50Irki_jmtyk6.png)

---

## Install the Algolia Plugin

In the directory of your Medusa backend, run the following command to install the Algolia plugin:

```bash npm2yarn
npm install medusa-plugin-algolia
```

Then, add the following environment variables to your Medusa backend:

```bash
ALGOLIA_APP_ID=<YOUR_APP_ID>
ALGOLIA_ADMIN_API_KEY=<YOUR_ADMIN_API_KEY>
```

Where `<YOUR_APP_ID>` and `<YOUR_ADMIN_API_KEY>` are respectively the Application ID and Admin API Key found on the [API Keys page](#retrieve-api-keys).

Finally, in `medusa-config.js` add the following item into the `plugins` array:

```js title="medusa-config.js"
const plugins = [
  // ...
  {
    resolve: `medusa-plugin-algolia`,
    options: {
      applicationId: process.env.ALGOLIA_APP_ID,
      adminApiKey: process.env.ALGOLIA_ADMIN_API_KEY,
      settings: {
        // index settings...
      },
    },
  },
]
```

### Index Settings

Under the `settings` key of the plugin's options, you can add settings specific to each index. The settings are of the following format:

```js
const plugins = [
  // ...
  {
    resolve: `medusa-plugin-algolia`,
    options: {
      // other options...
    settings: {
      indexName: {
        indexSettings: {
          searchableAttributes,
          attributesToRetrieve,
        },
        transformer: (product) => ({ 
          objectID: product.id, 
          // other attributes...
        }),
      },
    },
    },
  },
]
```

Where:

- `indexName`: the name of the index to create in Algolia. For example, `products`. Its value is an object containing the following properties:
  - `indexSettings`: an object that includes the following properties:
    - `searchableAttributes`: an array of strings indicating the attributes in the product entity that can be searched.
    - `attributesToRetrieve`: an array of strings indicating the attributes in the product entity that should be retrieved in the search results.
  - `transformer`: an optional function that accepts a product as a parameter and returns an object to be indexed. This allows you to have more control over what you're indexing. For example, you can add details related to variants or custom relations, or you can filter out certain products.

Using this index settings structure, you can add more than one index.

:::tip

These settings are just examples of what you can pass to the Algolia provider. If you need to pass more settings to the Algolia SDK you can pass it inside `indexSettings`.

:::

Here's an example of the settings you can use:

```js title="medusa-config.js"
const plugins = [
  // ...
  {
    resolve: `medusa-plugin-algolia`,
    options: {
      // other options...
      settings: {
        products: {
          indexSettings: {
            searchableAttributes: ["title", "description"],
            attributesToRetrieve: [
              "id",
              "title",
              "description",
              "handle",
              "thumbnail",
              "variants",
              "variant_sku",
              "options",
              "collection_title",
              "collection_handle",
              "images",
            ],
          },
        },
      },
    },
  },
]
```

---

## Test the Algolia Plugin

Run your Medusa backend with the following command:

```bash npm2yarn
npx medusa develop
```

The quickest way to test that the integration is working is by sending a `POST` request to `/store/products/search`. This API Route accepts a `q` body parameter of the query to search for and returns in the result the products that match this query.

![Postman request send to the search API Route that retrieves products using Algolia](https://res.cloudinary.com/dza7lstvk/image/upload/v1668000054/Medusa%20Docs/Algolia/IHeTsi7_ymhb2p.png)

You can also check that the products are properly indexed by opening your Algolia dashboard and choosing Search from the left sidebar. You’ll find your products that are on your Medusa backend added there.

:::note

If you have more than one application on your Algolia account, make sure you’re viewing the keys of the correct one by checking the Application dropdown at the top left.

:::

![Products from the Medusa backend can be seen on the Algolia dashboard](https://res.cloudinary.com/dza7lstvk/image/upload/v1668000071/Medusa%20Docs/Algolia/wkXzUH0_dowyxj.png)

### Add or Update Products

If you add or update products on your Medusa backend, the addition or update will be reflected in the Algolia indices.

:::note

This feature is only available if you have an event module installed in your Medusa backend, as explained in the Prerequisites section.

:::

---

## Add Search to your Storefront

In this section, you’ll learn how to add the UI on your storefront to allow searching with Algolia. This section has instructions for Medusa’s [Next.js Starter Template](../../starters/nextjs-medusa-starter.mdx) as well as React-based frameworks.

### Storefront Prerequisites

It is assumed you already have a storefront set up and working with the Medusa backend, as this section only covers how to add the search UI.

:::tip

If you don’t have a storefront set up, you can use the [Next.js Starter Template](../../starters/nextjs-medusa-starter.mdx) that Medusa provides.

:::

### Add to Next.js Starter Template

The Next.js Starter Template has the Algolia integration available out of the box. To get it working, you just need to follow three steps.

First, ensure that the search feature is enabled in `store.config.json`:

```json title="store.config.json"
{
  "features": {
    "search": true
  }
}
```

Then, add the necessary environment variables:

```bash
NEXT_PUBLIC_SEARCH_APP_ID=<YOUR_APP_ID>
NEXT_PUBLIC_SEARCH_API_KEY=<YOUR_SEARCH_API_KEY>
NEXT_PUBLIC_INDEX_NAME=products
```

Where `<YOUR_APP_ID>` and `<YOUR_SEARCH_API_KEY>` are respectively the Application ID and Search-Only API Key on the [API Keys page](#retrieve-api-keys).

Finally, change the code in `src/lib/search-client.ts` to the following:

```ts title="src/lib/search-client.ts"
import algoliasearch from "algoliasearch/lite"

const appId = process.env.NEXT_PUBLIC_SEARCH_APP_ID || ""

const apiKey = process.env.NEXT_PUBLIC_SEARCH_API_KEY || ""

export const searchClient = algoliasearch(appId, apiKey)

export const SEARCH_INDEX_NAME =
  process.env.NEXT_PUBLIC_INDEX_NAME || "products"
```

If you run your Next.js Starter Template now while the Medusa backend is running, the search functionality will be available in your storefront.

:::note

To make sure the Next.js Starter Template properly displays the products in the search result, include in the `attributesToRetrieve` setting of the Algolia plugin on the Medusa backend at least the fields `id`, `title`, `handle`, `description`, and `thumbnail`.

:::

![Search Result on Next.js Starter Storefront](https://res.cloudinary.com/dza7lstvk/image/upload/v1701112725/Medusa%20Docs/Screenshots/Screenshot_2023-11-27_at_7.18.09_PM_iozjt0.png)

### Add to Other Storefronts

To integrate Algolia's search functionalities in your storefront, please refer to [Algolia's InstantSearch.js documentation](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/js/). You'll find packages for different frontend frameworks and how you can use them.

---

## See Also

- [Deploy your Medusa backend](../../deployments/server/index.mdx)
- [Deploy your storefront](../../deployments/storefront/index.mdx)
