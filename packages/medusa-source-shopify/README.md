# Medusa Source Shopify
Plugin that allows users to source Medusa using a Shopify store.

## Quick start

This plugin will copy all of your products and collections from Shopify to Medusa. 

To get started with the plugin you should follow these steps.

### Install the plugin

Navigate to your Medusa server in your terminal, and install the plugin.

```zsh
$ cd my-medusa-server
$ yarn medusa-source-shopify
```

### Create a Shopify app

Navigate to your Shopify dashboard, and then go to `Apps` and click the `Develop apps for your store` button at the bottom of the page. After navigating to the `App development` page, click the `Create an app` in the top right corner.

This should open a modal where you can choose a name for your app. Write a name and click `Create app`.

You should then click the button that says `Configure Admin API scopes`. Scroll down to `Products` and select the `read_products` scope, and then save your changes.

Go back to overview and click `Install app`. This should generate a token, that you should write down as you can only view it once.


### Add the required plugin options

Update your `medusa-config.js` with the following:

```js
//Shopify keys
const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL || "";
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || "";

const plugins = [
  // other plugins...
  {
    resolve: `medusa-source-shopify`,
    options: {
      domain: SHOPIFY_STORE_URL,
      password: SHOPIFY_API_KEY,
    },
  },
];
```

You should then add `SHOPIFY_STORE_URL` and `SHOPIFY_API_KEY` to your `.env`.

```env
SHOPIFY_API_KEY=<your_secret_shopify_key>
SHOPIFY_STORE_URL=<your_store_name>
```

The `SHOPIFY_API_KEY` is the token that we generated in the previous step. `SHOPIFY_STORE_URL` is the name of your store. You can view the name in the url of your Shopify dashboard, which has the following format `<your_store_name>.myshopify.com`.

### Run your server

After setting everything up you can now run your server

```zsh
$ yarn start
```

and the plugin will handle the rest.

## Note

### The plugin only queries updates since last build time

The plugin stores everytime it is run, and will use this timestamp to only fetch products, collections and collects that have been updated in Shopify since the last time it pulled data.

### `Product/Collection` relations (`Collect`)
Shopify supports products being part of more than one collection, but Medusa does not support this. For this reason a product will only be part of the first collection it has a relation to in Medusa. The plugin processes Shopify product/collection relations in the following order:

1. Custom collections
2. Smart collections

This means that if product `X` is part of custom collection `Y` and smart collection `Z` in Shopify, it will only be added to custom collection `X` in Medusa.



