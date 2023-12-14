---
addHowToData: true
---

# Manual Fulfillment Plugin

This document will guide you through installing the manual fulfillment plugin on your Medusa backend.

## Overview

With Medusa, you can create or integrate fulfillment providers as plugins. Medusa also provides the manual fulfillment plugin as a minimal plugin that allows merchants to handle fulfillments manually. This plugin is installed by default in your Medusa backend.

The manual fulfillment plugin is similar to a cash-on-delivery (COD) fulfillment plugin. A merchant can provide shipping options to the customer on checkout, and create fulfillments and shipments for orders. This data is stored in Medusa, but no actual fulfillment actions are performed, such as communicating with a third-party service. The merchant is assumed to handle that themselves.

---

## Prerequisites

A Medusa backend is required to be set up before following along with this document. You can follow the [quickstart guide](../../create-medusa-app.mdx) to get started in minutes.

---

## Install Plugin

In the directory of your Medusa backend, run the following command to install the plugin:

```bash npm2yarn
npm install medusa-fulfillment-manual
```

Finally, add the plugin to the `plugins` array in `medusa-config.js`:

```js title="medusa-config.js"
const plugins = [
  // ...
  {
    resolve: `medusa-fulfillment-manual`,
  },
]
```

---

## Test the Plugin

To test the plugin, run the following command in the directory of the Medusa backend to start the backend:

```bash
npx medusa develop
```

Then, you must enable the Manual Fulfillment Provider in at least one region to use it. You can do that using either the [Medusa Admin](../../user-guide/regions/providers.mdx), which is available at `http://localhost:7001` after you run the above command, or the [Admin REST APIs](../../modules/regions-and-currencies/admin/manage-regions.mdx).

After enabling the provider, you must add shipping options for that provider. You can also do that using either the [Medusa Admin](../../user-guide/regions/shipping-options.mdx) or the [Admin REST APIs](../../modules/regions-and-currencies/admin/manage-regions.mdx#add-a-shipping-option-to-a-region).

Finally, try to place an order using either a [storefront](../../starters/nextjs-medusa-starter.mdx) or the [Store APIs](https://docs.medusajs.com/api/store). You should be able to use the shipping options you created for the fulfillment provider.
