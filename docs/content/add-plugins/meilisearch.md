# MeiliSearch

In this document, you’ll learn how to install the [MeiliSearch plugin](https://github.com/medusajs/medusa/tree/master/packages/medusa-plugin-meilisearch) and use it on both your Medusa Server and your storefront.

## Overview

[MeiliSearch](https://www.meilisearch.com/) is a super-fast, open source search engine built in Rust. It comes with a wide range of features including typo-tolerance, filtering, and sorting.

MeiliSearch also provides a pleasant developer experience, as it is extremely intuitive and newcomer-friendly. So, even if you're new to the search engine ecosystem, [their documentation](https://docs.meilisearch.com/) is resourceful enough for everyone to go through and understand.

Through Medusa's flexible plugin system, it is possible to add a search engine to your Medusa server and storefront using MeiliSearch with just a few steps.

## Prerequisites

### Medusa Components

It is required to have a Medusa server installed before starting with this documentation. If not, please follow along with our [quickstart guide](../quickstart/quick-start.md) to get started in minutes.

Furthermore, it’s highly recommended to ensure your Medusa server is configured to work with Redis. As Medusa uses Redis for the event queue internally, configuring Redis ensures that the search indices in MeiliSearch are updated whenever products on the Medusa server are updated. You can follow [this documentation to install Redis](../tutorial/0-set-up-your-development-environment.mdx#redis) and then [configure it on your Medusa server](../usage/configurations.md#redis).

:::caution

If you don’t install and configure Redis on your Medusa server, the MeiliSearch integration will still work. However, products indexed in MeiliSearch are only added and updated when you restart the Medusa server.

:::

### MeiliSearch Instance

You must install MeiliSearch to use it with Medusa. You can follow [this documentation to install MeiliSearch](https://docs.meilisearch.com/learn/getting_started/quick_start.html#setup-and-installation) either locally or on a cloud.

Furthermore, you should create a master key for your MeiliSearch instance. If you don’t have one created, follow [this guide](https://docs.meilisearch.com/learn/security/master_api_keys.html#protecting-a-meilisearch-instance) to create a master key.

## Install the MeiliSearch Plugin

In the directory of your Medusa server, run the following command to install the MeiliSearch plugin:

```bash npm2yarn
npm install medusa-plugin-meilisearch
```

Then, add the following environment variables to your Medusa server:

```bash
MEILISEARCH_HOST=<YOUR_MEILISEARCH_HOST>
MEILISEARCH_API_KEY=<YOUR_MASTER_KEY>
```

Where `<YOUR_MEILISEARCH_HOST>` is the host of your MeiliSearch instance. By default, if MeiliSearch is installed locally, the host is `http://127.0.0.1:7700`.

`<YOUR_MASTER_KEY>` is the master key of your MeiliSearch instance.

Finally, in `medusa-config.js` add the following item into the `plugins` array:

```jsx
const plugins = [
  //...
  {
    resolve: `medusa-plugin-meilisearch`,
    options: {
      // config object passed when creating an instance of the MeiliSearch client
      config: {
        host: process.env.MEILISEARCH_HOST,
        apiKey: process.env.MEILISEARCH_API_KEY,
      },
      settings: {
        // index name
        products: {
          // MeiliSearch's setting options to be set on a particular index
          searchableAttributes: ["title", "description", "variant_sku"],
          displayedAttributes: ["title", "description", "variant_sku", "thumbnail", "handle"],
        },
      },
    },
  },
];
```

You can change the `searchableAttributes` and `displayedAttributes` as you see fit. However, the attributes included are the recommended attributes.

## Test MeiliSearch Plugin

Make sure your MeiliSearch instance is running. If you’re unsure how to run it, you can check the [installation documentation](https://docs.meilisearch.com/learn/getting_started/quick_start.html#setup-and-installation) for the command to run the MeiliSearch instance.

Then, run the Medusa server:

```bash npm2yarn
npm run start
```

The quickest way to test that the integration is working is by sending a `POST` request to `/store/products/search`. This endpoint accepts a `q` body parameter of the query to search for and returns in the result the products that match this query.

![Postman request to search endpoint that shows results returned from the search engine](https://i.imgur.com/RCGquxU.png)

You can also check that the products are properly indexed by opening the MeiliSearch host URL in your browser, which is `http://127.0.0.1:7700/` by default. You’ll find your products that are on your Medusa server added there.

![MeiliSearch dashboard showing products from the Medusa server indexed](https://i.imgur.com/5sk3jyP.png)

### Add or Update Products

If you add or update products on your Medusa server, the addition or update will be reflected in the MeiliSearch indices.

:::note

This feature is only available if you have Redis installed and configured with your Medusa server as mentioned in the [Prerequisites section](#prerequisites). Otherwise, you must re-run the Medusa server to see the change in the MeiliSearch indices.

:::

## Add Search to your Storefront

In this section, you’ll learn how to add the UI on your storefront to allow searching with MeiliSearch. This section has instructions for Medusa’s [Next.js](../starters/nextjs-medusa-starter.md) storefront as well as React-based frameworks such as the [Gatsby storefront](../starters/gatsby-medusa-starter.md).

### Storefront Prerequisites

It is assumed you already have a storefront set up and working with the Medusa server, as this section only covers how to add the search UI.

:::tip

If you don’t have a storefront set up, you can use the [Gatsby](../starters/gatsby-medusa-starter.md) or [Next.js](../starters/nextjs-medusa-starter.md) storefronts Medusa provides.

:::

Furthermore, you must create an API key in your MeiliSearch instance that will be used to search on the storefront. To do that, run the following command in your terminal while the MeiliSearch instance is running:

```bash
curl \
  -X POST '<MEILISEARCH_HOST>/keys' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <MEILISEARCH_MASTER_KEY>' \
  --data-binary '{
    "description": "Search products",
    "actions": ["search"],
    "indexes": ["products"],
    "expiresAt": "2024-01-01T00:00:00Z"
  }'
```

Make sure to replace `<MEILISEARCH_HOST>` and `<MEILISEARCH_MASTER_KEY>` accordingly.

If this request is successful, the API key will be available under the `key` property returned in the JSON response.

### Add to Next.js Storefront

The Next.js storefront has the MeiliSearch integration available out of the box. To get it working, you just need to follow two steps.

First, ensure that the search feature is enabled in `store.config.json`:

```json
{
  "features": {
    "search": true
  }
}
```

Then, add the necessary environment variables:

```bash
NEXT_PUBLIC_SEARCH_ENDPOINT=<YOUR_MEILISEARCH_HOST>
NEXT_PUBLIC_SEARCH_API_KEY=<YOUR_API_KEY>
NEXT_PUBLIC_SEARCH_INDEX_NAME=products
```

Make sure to replace `<YOUR_MEILISEARCH_HOST>` with your MeiliSearch host and `<YOUR_API_KEY>` with the API key you created as instructed in the [Storefront Prerequisites](#storefront-prerequisites) section.

If you run your Next.js storefront now while the Medusa server and the MeiliSearch services are running, the search functionality will be available in your storefront.

:::note

To make sure the Next.js storefront properly displays the products in the search result, include in the `displayedAttributes` setting of the MeiliSearch plugin on the Medusa server at least the fields `title`, `handle`, `description`, and `thumbnail`.

:::

![Search Result on Next.js storefront](https://i.imgur.com/gQVWvH2.png)

### Add to Gatsby and React-Based Storefronts

This section covers adding the search UI to React-based storefronts. It uses the Gatsby storefront as an example, but you can use the same steps on any React-based framework.

:::tip

For other frontend frameworks, please check out [MeiliSearch’s Integrations guide](https://github.com/meilisearch/integration-guides) for steps based on your framework.

:::

In the directory that contains your storefront, run the following command to install the necessary dependencies:

```bash npm2yarn
npm install react-instantsearch-dom @meilisearch/instant-meilisearch
```

Then, add the following environment variables:

```bash
GATSBY_MEILISEARCH_HOST=<YOUR_MEILISEARCH_HOST>
GATSBY_MEILISEARCH_API_KEY=<YOUR_API_KEY>
GATSBY_SEARCH_INDEX_NAME=products
```

Make sure to replace `<YOUR_MEILISEARCH_HOST>` with your MeiliSearch host and `<YOUR_API_KEY>` with the API key you created as instructed in the [Storefront Prerequisites](#storefront-prerequisites) section.

:::caution

In Gatsby, environment variables that should be public and available in the browser are prefixed with `GATSBY_`. If you’re using another React-based framework, you might need to use a different prefix to ensure these variables can be used in your code. Please refer to your framework’s documentation for help on this.

:::

Then, create the file `src/components/header/search.jsx` with the following content:

```jsx
import {
  Highlight,
  Hits,
  InstantSearch,
  SearchBox,
  connectStateResults
} from "react-instantsearch-dom"

import React from "react"
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch"

const searchClient = instantMeiliSearch(
  process.env.GATSBY_MEILISEARCH_HOST,
  process.env.GATSBY_MEILISEARCH_API_KEY
)

const Search = () => {
  const Results = connectStateResults(({ searchState, searchResults, children }) =>
    searchState && searchState.query && searchResults && searchResults.nbHits !== 0 ? (
      <div className="absolute top-full w-full p-2 bg-gray-200 shadow-md">
        {children}
      </div>
    ) : (
      <div></div>
    )
  );

  return (
    <div className="relative">
      <InstantSearch indexName={process.env.GATSBY_SEARCH_INDEX_NAME} searchClient={searchClient}>
        <SearchBox submit={null} reset={null} />
        <Results>
          <Hits hitComponent={Hit} />
        </Results>
      </InstantSearch>
    </div>
  )
}

const Hit = ({ hit }) => {
  return (
    <div key={hit.id} className="relative">
      <div className="hit-name">
        <Highlight attribute="title" hit={hit} tagName="mark" />
      </div>
    </div>
  )
}

export default Search;
```

This file uses the dependencies you installed to show the search results. It also initializes MeiliSearch using the environment variables you added.

:::caution

If you named your environment variables differently based on your framework, make sure to rename them here as well.

:::

Finally, import this file at the beginning of `src/components/header/index.jsx`:

```jsx
import Search from "./search"
```

And add the `Search` component in the returned JSX before `RegionPopover`:

```jsx
//...
<Search />
<RegionPopover regions={mockData.regions} />
//...
```

If you run your Gatsby storefront while the Medusa server and the MeiliSearch instance are running, you should find a search bar in the header of the page. Try entering a query to search through the products in your store.

![Search box in the header of the storefront](https://i.imgur.com/ZkRgF2h.png)

## What’s Next 🚀

- Learn how to [deploy your Medusa server](../deployments/server/index.mdx).
- Learn how to [deploy your Gatsby storefront](./../deployments/storefront/deploying-gatsby-on-netlify.md).
