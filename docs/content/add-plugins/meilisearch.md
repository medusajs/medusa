# MeiliSearch

### Introduction

Search functionality is one of the most useful and important features in e-commerce platforms. From increasing customer conversion rates to significantly improving the user experience, search engines can enable significant business growth. Medusa brings search functionality to your doorstep by leveraging some of the already existing search engines out there.

We have developed a plugin that will allow you to use the performant, open-source, and feature-rich search engine MeiliSearch. 

MeiliSearch is a super-fast, open-source, search engine built in Rust. It comes with a wide range of features such as typo-tolerance, filtering, sorting, and [much more](https://docs.meilisearch.com/learn/what_is_meilisearch/features.html). MeiliSearch also provides a pleasant developer experience, as it is extremely intuitive and newcomer-friendly - so even if you're new to the search engine "ecosystem", you'll have a great time navigating through their documentation. 

Through Medusa flexible plugin system, it is possible to enable search functionality into your medusa applications with minimum hassle by including our new plugin `medusa-plugin-meilisearch` to your `medusa-config.js` file.

### Installation

In case you don't have MeiliSearch installed locally on your environment yet, you can run the following:

```bash
# Install MeiliSearch
curl -L https://install.meilisearch.com | sh

# Launch MeiliSearch
./meilisearch
```

For other installation alternatives, you can head over to Meilisearch's [installation guide](https://docs.meilisearch.com/learn/getting_started/installation.html). 

In order to add the plugin to your medusa project, you will need to first install the plugin using your favorite package manager:

```bash
# yarn
yarn add medusa-plugin-meilisearch

# npm
npm install medusa-plugin-meilisearch
```

Then in your `medusa-config.js` file, add the plugin to your `plugins` array. For this example, assumption is that you're leveraging MeiliSearch to perform searches on an index called `products`

```jsx
module.exports = {
	// ...other options
	plugins: [
		// ...other plugins
		{
			resolve: `medusa-plugin-meilisearch`,
			options: {
				// config object passed when creating an instance of the MeiliSearch client
				config: {
					host: "http://127.0.0.1:7700",
					apiKey: "your_master_key"
				},
				settings: {
					// index name
					products: {
						// MeiliSearch's setting options to be set on a particular index
						searchableAttributes: ["title", "description", "variant_sku"],
						displayedAttributes: ["title", "description", "variant_sku"],
					},
				},
			},
		},
	],
};
```

Et voilà! That's all it takes to make medusa and MeiliSearch work in great harmony. Please note that you can use any other setting from this [list](https://docs.meilisearch.com/reference/features/settings.html#settings) such as `filterableAttributes`, `sortableAttributes`, and `synonyms`. We are working on another blog post that will demonstrate how you can make use of these settings to build a great storefront experience, so stay tuned to that!

### Simple Usage

Medusa exposes an API layer that can serve as an abstraction over various search providers. We will now be interacting with one of the search routes parts of that layer, namely, the `POST /store/products/search` route. The route will enable you to test out the integration between Medusa and MeiliSearch. The endpoint takes a mandatory `q` property and a set of optional parameters which will be passed to MeiliSearch's `search()` method as a second argument. The list of the parameters which can be provided can be found in MeiliSearch's [docs](https://docs.meilisearch.com/reference/api/search.html#search-in-an-index-with-post-route). 

Let's use Postman for this short demo to get some search results:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zu09kroufrux94y6d5rq.png)

We tried to perform a search query "creneck" to find all crewnecks in our store. Note how the explicit mistake of leaving a "w" out from "crewneck" still yields the correct results.

Postman is not the most exciting client to use to showcase this, so in the next section, there is a short guide on how you can use React and MeiliSearchh's ecosystem to build something that looks better than JSON.

### Highlighting and Pagination in a React Storefront

The Medusa + MeiliSearch integration opens up a lot of capabilities for creating a rich UX for your storefront. The plugin indexes all your products and listens to any updates made on them, so you can then leverage any client-side SDKs developed by the MeiliSearch team to build cool search experiences for storefronts. For example, MeiliSearch exposes a React [adapter](https://github.com/meilisearch/meilisearch-react/) that can be used with React InstantSearch (made by Algolia) which provides features such as highlighting, filtering, and pagination out of the box. 

In order to leverage this functionality, you'll need to install the corresponding packages by running:

```bash
# npm
npm install react-instantsearch-dom @meilisearch/instant-meilisearch
# yarn
yarn add react-instantsearch-dom @meilisearch/instant-meilisearch
```

You can then use the MeiliSearch client in your react app:

```jsx
import React from 'react';
import {
  InstantSearch,
  Hits,
  SearchBox,
  Pagination,
  Highlight,
} from "react-instantsearch-dom";
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';

const searchClient = instantMeiliSearch(
  "http://127.0.0.1:7700",
  "your_master_key"
);

const SearchPage = () => (
  <InstantSearch
    indexName="products"
    searchClient={searchClient}
  >
    <SearchBox />
    <Hits hitComponent={Hit} />
    <Pagination />
  </InstantSearch>
);

const Hit = ({ hit }) => {
	return (
	  <div key={hit.id}>
	    <div className="hit-name">
	      <Highlight attribute="name" hit={hit} />
	    </div>
	    <img src={hit.image} align="left" alt={hit.name} />
	    <div className="hit-description">
	      <Snippet attribute="description" hit={hit} />
	    </div>
	    <div className="hit-info">price: {hit.price}</div>
	    <div className="hit-info">release date: {hit.releaseDate}</div>
	  </div>
	)
}
```

If you want to play around with the various features provided by React InstantSearch you can read more on algolia's [documentation](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/). You can also use MeiliSearch's react [demo](https://codesandbox.io/s/ms-react-is-sh9ud?fontsize=14&hidenavigation=1&theme=dark&file=/src/App.js) for a more interactive example.

### Demo: Palmes Storefront

By using the above libraries (React, `react-instantsearch-dom`, and `instant-meilisearch`) in addition to the medusa plugin, we have successfully integrated the MeiliSearch plugin for one of our customers: Palmes. Following is a short GIF demoing the functionality. 

[Palmes Tennis Society.mp4](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e0b596ab-e146-4151-a8b0-42c94401761f/Palmes_Tennis_Society.mp4)

### Enhance your development experience with MeiliSearch's Web UI

For a quicker feedback loop on what's happening on your search engine, you can use MeiliSearch's helpful out-of-the-box web interface to run some searches and get live results. It comes with MeiliSearch when you first install it and requires 0 configuration. When integrating the MeiliSearch plugin to existing medusa projects, we also found it to be extremely helpful for debugging

<iframe src="https://player.vimeo.com/video/639184340?h=593662d9f6" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>

### More to come

As briefly mentioned before, we're preparing another blog post that dives a bit deeper into the Medusa Search API and provides a more in-depth walkthrough on how to build a feature-rich search experience that includes filtering, synonyms, stop-words, and more!