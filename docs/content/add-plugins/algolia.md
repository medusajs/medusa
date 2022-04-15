# Algolia

We recently launched our sophisticated [Medusa](https://github.com/medusajs/medusa) Search API. It allows you to add a blazingly fast product search to your ecommerce setup, improving the overall customer experience and your conversion rates.

From a developer perspective, the Search API unifies communication between Medusa and search engines thereby allowing you to switch between different engines in seconds with only a couple of lines of code. So far, Medusa has only supported product search using MeiliSearch, but we can now proudly present a plugin for Algolia - one of the giants.

The purpose of this article is to show you how to install and configure Algolia for your Medusa store. Additionally, we'll showcase the powerful Search API by guiding you through changing from one search engine to another.

**Installation**

Create an account on Algolia and grab your Application ID and Admin API Key from the settings panel.

![algolia-config](https://i.imgur.com/kR6lWhI.png)

In your Medusa project, install the plugin using your favourite package manager:

```bash npm2yarn
npm install medusa-plugin-algolia@canary
```

In your `medusa-config.js` add the integration to the array of plugins with the following settings:

```jsx
const plugins = [
  // ...other plugins
  {
    resolve: `medusa-plugin-algolia`,
    options: {
      application_id: "your-application-id",
      admin_api_key: "your-admin-api-key",
      settings: {
        products: {
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
]
```

In the above config, you've provided the id and key from Algolia alongside a couple of settings, that define the properties you can search for and the values you'll get in return.

And that's all! You've now enabled Algolia for your Medusa store engine. The plugin will make sure to synchronize products from Medusa to Algolia upon updating, deleting, or creating new ones. Now all you need to do is to restart your server.

**Usage**

This article will not go too much into depth about how the search functionality works under the hood when querying the API. We refer to the [previous article on MeiliSearch](https://www.medusajs.com/post/meilisearch-and-medusa) if this is of your interest. In there, you will find a quick showcase using Postman as well as a thorough walkthrough of how you can display the results in your storefront using ReactJS (GatsbyJS).

Instead, to illustrate the power of our Search API and search engine plugins, we'll switch out a MeiliSearch plugin with our new Algolia plugin in a store with existing products. Upon restarting the server with the new configuration, your products will automatically be fed into Algolia and the search functionality in your frontend will remain unchanged.

![Imgur](https://i.imgur.com/rIgAh6T.gif)

**Next up**

As mentioned in our post on MeiliSearch, we'll soon publish an article with a thorough walkthrough of our Search API. Until then, you should consider adding blazingly fast product search with one of our plugins to allow for your commerce business to grow to the next level.

Many thanks to community member Rolwin for building the plugin. If you want to be part of the Medusa community, feel free to join us on our [Discord channel](https://discord.gg/F87eGuwkTp).
