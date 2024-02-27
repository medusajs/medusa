---
addHowToData: true
---

# Shopify Source Plugin

This document will guide you through installing the shopify source plugin on your Medusa backend.

## Overview

If you're migrating from Shopify to Medusa, this plugin will facilitate the process for you. It migrates data related to your products on Shopify to Medusa. It also registers a scheduled job that runs periodically and ensures your data is synced between Shopify and Medusa.

---

## Prerequisites

### Medusa Backend

A Medusa backend is required to be set up before following along with this document. You can follow the [quickstart guide](../../create-medusa-app.mdx) to get started in minutes.

### Shopify Account

Using this plugin requires having a Shopify account with access to development keys and resources.

### Private Shopify App

This plugin authenticates with Shopify through a private app that has Read access to products.

To create a private app:

1. Open your Shopify store's dashboard
2. Choose Apps from the sidebar
3. Scroll down and click on "Manage private apps"
4. If asked, enable private app development.
5. Once enabled, click on the "Create private app" button.
6. In the form, enter the app's name and email. 
7. In the Admin API section, click on "Show inactive Admin API permissions" then, for Products, choose "Read Access".
8. Once done, click on the "Save" button.
9. Click the "Create App" button in the pop-up that shows up.
10. Copy the Password to use for the plugin's configurations.

---

## Install Plugin

In the directory of your Medusa backend, run the following command to install the plugin:

```bash npm2yarn
npm install medusa-source-shopify
```

Then, add the following environment variables to `.env`:

```bash
SHOPIFY_DOMAIN=<YOUR_SHOPIFY_DOMAIN>
SHOPIFY_PASSWORD=<YOUR_SHOPIFY_PASSWORD>
```

Where:

- `<YOUR_SHOPIFY_DOMAIN>` is the subdomain of the Shopify store that you're migrating. If you're not sure what it is, your store's domain should be of the format `<DOMAIN>.myshopify.com`. The `<DOMAIN>` is the value of this environment variable.
- `<YOUR_SHOPIFY_PASSWORD>` is the password for the [private app](#private-shopify-app) you created.

Finally, add the plugin to the `plugins` array in `medusa-config.js`:

```js title="medusa-config.js"
const plugins = [
  // ...,
  {
    resolve: "medusa-source-shopify",
    options: {
      domain: process.env.SHOPIFY_DOMAIN,
      password: process.env.SHOPIFY_PASSWORD,
    },
  },
]
```

---

## Test the Plugin

To test the plugin, run the following command in the directory of the Medusa backend to start the backend:

```bash
npx medusa develop
```

As the backend starts, so does the migration script. The products and its data will be migrated into Medusa.
